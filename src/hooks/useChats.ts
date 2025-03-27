import { getAllChatsService, getChatMessagesService } from "services/chat.service";

export const useChats = () => {
  const getAllChats = async () => {
    const chatRes = await getAllChatsService();
    const chats = chatRes?.chats || [];
    return chats;
  };

  const getChatMessages = async (id: string) => {
    const res = await getChatMessagesService(id);
    const messages = res?.historyMessages || [];
    return messages;
  }

  return { getAllChats, getChatMessages };
};
