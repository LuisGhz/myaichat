import { DEFAULT_MODEL, MODELS } from "core/const/Models";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";
import {
  getChatMessagesService,
  sendNewMessageService,
} from "../services/ChatService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const useChat = () => {
  const { model, promptId, messages } = useChatStore();
  const { setModel, setPromptId, setCurrentChatMetadata, setMessages } =
    useChatStoreActions();
  const { chatsSummary } = useAppStore();
  const { setChatsSummary, setIsGettingNewChat } = useAppStoreActions();

  const resetChatData = () => {
    setModel(DEFAULT_MODEL);
    setPromptId(undefined);
    setMessages([]);
  };

  const getChatMessages = async (id: string, page: number = 0) => {
    const response = await getChatMessagesService(id, page);
    if (response) {
      setMessages(response.historyMessages);
      const modelName = MODELS.find((m) => m.value === response.model)!.name;
      setCurrentChatMetadata({
        totalPromptTokens: response.totalPromptTokens,
        totalCompletionTokens: response.totalCompletionTokens,
        maxOutputTokens: response.maxOutputTokens,
        isWebSearchMode: response.isWebSearchMode,
        model: modelName,
      });
    }
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
    setIsGettingNewChat(true);
    try {
      const res = await sendNewMessageService(formData);
      if (res?.isNew) {
        const newChatSummary: ChatSummary = {
          id: res.chatId,
          fav: false,
        };
        setChatsSummary([...chatsSummary, newChatSummary]);
        return res.chatId;
      }
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  };

  return {
    model,
    promptId,
    messages,
    resetChatData,
    getChatMessages,
    sendNewMessage,
  };
};
