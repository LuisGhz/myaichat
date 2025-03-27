import { apiClient } from "api";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import { ChatsRes } from "types/chat/ChatsRes.type";

export const getAllChatsService = async () => {
  return await apiClient.get<ChatsRes>("/chat/all");
};

export const getChatMessagesService = async (id: string) => {
  return await apiClient.get<ChatMessagesRes>(`/chat/${id}/messages`);
}
