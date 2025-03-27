import { apiClient } from "api";
import { Chats } from "types/chat/Chats.type";

export const getAllChatsService = async () => {
  return await apiClient.get<Chats>("/chat/chats");
};
