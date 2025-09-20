import { DEFAULT_MODEL, MODELS } from "core/const/Models";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";
import {
  changeMaxOutputTokensService,
  getChatMessagesService,
  sendNewMessageService,
  toggleWebSearchModeService,
} from "../services/ChatService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const useChat = () => {
  const { model, promptId, messages } = useChatStore();
  const { setModel, setPromptId, setCurrentChatMetadata, setMessages, setMaxOutputTokens, setIsWebSearchMode } =
    useChatStoreActions();
  const { chatsSummary } = useAppStore();
  const { setChatsSummary } = useAppStoreActions();

  const resetChatData = () => {
    setModel(DEFAULT_MODEL);
    setPromptId(undefined);
    setMessages([]);
  };

  const getChatMessages = async (id: string, page: number = 0) => {
    const response = await getChatMessagesService(id, page);
    if (response) {
      // Only update messages for pagination (page > 0), update all metadata for initial load (page 0)
      setMessages(response.historyMessages);
      
      // Only update chat metadata on the first page (most recent state)
      if (page === 0) {
        const modelName = MODELS.find((m) => m.value === response.model)?.name;
        setMaxOutputTokens(response.maxOutputTokens);
        setIsWebSearchMode(response.isWebSearchMode);
        setCurrentChatMetadata({
          totalPromptTokens: response.totalPromptTokens,
          totalCompletionTokens: response.totalCompletionTokens,
          model: modelName,
        });
      }
    }
  };

  const loadPreviousMessages = async (id: string, page: number) => {
    const response = await getChatMessagesService(id, page);
    if (response && response.historyMessages.length > 0) {
      // Prepend new messages to existing ones (only update messages, not metadata)
      setMessages([...response.historyMessages, ...messages]);
      return response.historyMessages.length;
    }
    // Return -1 to indicate empty page
    return response ? -1 : 0;
  };

  const sendNewMessage = async (req: SendNewMessageReq) => {
    const formData = new FormData();
    formData.append("content", req.content);
    formData.append("maxOutputTokens", String(req.maxOutputTokens));
    formData.append("isWebSearchMode", String(req.isWebSearchMode));
    if (req?.model) formData.append("model", req.model);
    if (req?.chatId) formData.append("chatId", req.chatId);
    if (req?.file) formData.append("file", req.file);
    if (req?.promptId) formData.append("promptId", req.promptId);
    const newMessage: ChatMessage = {
      content: req.content,
      role: "User",
      completionTokens: 0,
      promptTokens: 0,
      file: "",
    };
    const mergedMessages = [...messages, newMessage];
    setMessages(mergedMessages);
    try {
      const res = await sendNewMessageService(formData);
      if (!res) return;
      if (res.isNew) {
        const newChatSummary: ChatSummary = {
          id: res.chatId,
          fav: false,
        };
        setChatsSummary([...chatsSummary, newChatSummary]);
        return res.chatId;
      }
      return res.chatId;
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  };

  const toggleIsWebSearchMode = async (id: string, isWebSearchMode: boolean) => {
    try {
      await toggleWebSearchModeService(id, isWebSearchMode);
    } catch (error) {
      console.error("Error toggling web search mode:", error);
    }
  };

  const changeMaxOutputTokens = async (id: string, maxOutputTokens: number) => {
    try {
      await changeMaxOutputTokensService(id, maxOutputTokens);
    } catch (error) {
      console.error("Error changing max output tokens:", error);
    }
  };

  return {
    model,
    promptId,
    messages,
    resetChatData,
    getChatMessages,
    loadPreviousMessages,
    sendNewMessage,
    toggleIsWebSearchMode,
    changeMaxOutputTokens,
  };
};
