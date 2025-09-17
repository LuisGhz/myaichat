import { DEFAULT_MODEL } from "core/const/Models";
import { useState } from "react";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";
import { getChatMessagesService } from "../services/ChatService";

export const useChat = () => {
  const { model, promptId } = useChatStore();
  const { setModel, setPromptId } = useChatStoreActions();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const resetChatData = () => {
    setModel(DEFAULT_MODEL);
    setPromptId(undefined);
    setMessages([]);
  };

  const getChatMessages = async (id: string, page: number = 0) => {
    const response = await getChatMessagesService(id, page);
    if (response) {
      setMessages(response.historyMessages);
    }
  };

  return { model, promptId, resetChatData, getChatMessages, messages };
};
