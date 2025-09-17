import { apiClient } from "api";

export const getChatMessagesService = async (id: string, page: number = 0) => {
  return await apiClient.get<ChatMessagesRes>(
    `/chat/${id}/messages?page=${page}`
  );
};
