import { apiClient } from "api";

export const SideNavService = () => {
  const getChatSummary = async () => {
    return await apiClient.get<ChatSummaryRes>("/chat/all");
  };

  const toggleFavorite = async (chatId: string) => {
    return await apiClient.patch(`/chat/${chatId}/toggle-chat-fav`);
  };

  return { getChatSummary, toggleFavorite };
};
