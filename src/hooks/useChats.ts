import { getAllChatsService } from "services/chat.service";

export const useChats = () => {
  const getAllChats = async () => {
    const chats = await getAllChatsService();
    return chats;
  };

  return { getAllChats };
};
