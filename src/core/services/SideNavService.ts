import { apiClient } from "api";

export const getChatSummaryService = async () => {
  return await apiClient.get<ChatSummaryRes>("/chat/all");
};

export const toggleFavoriteService = async (chatId: string) => {
  return await apiClient.patch(`/chat/${chatId}/toggle-chat-fav`);
};
