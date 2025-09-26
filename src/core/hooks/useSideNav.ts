import { useAppMessage } from "shared/hooks/useAppMessage";
import {
  getChatSummaryService,
  toggleFavoriteService,
} from "../services/SideNavService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const useSideNav = () => {
  const { chatsSummary } = useAppStore();
  const { setChatsSummary } = useAppStoreActions();
  const { errorMessage } = useAppMessage();

  const getChatsSummary = async () => {
    try {
      const res = await getChatSummaryService();
      setChatsSummary(res?.chats || []);
    } catch (error) {
      errorMessage("Failed to fetch menu chats. Please try again later.");
      throw error;
    }
  };

  const toggleFavorite = async (chatId: string) => {
    const currentChat = chatsSummary.find((chat) => chat.id === chatId);
    if (!currentChat) return;
    const optimisticUpdate = chatsSummary.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, fav: !chat.fav };
      }
      return chat;
    });
    setChatsSummary(optimisticUpdate);

    try {
      await toggleFavoriteService(chatId);
    } catch (error) {
      setChatsSummary(chatsSummary);
      errorMessage("Failed to update favorite status. Please try again later.");
      throw error;
    }
  };

  return { chatsSummary, getChatsSummary, toggleFavorite };
};
