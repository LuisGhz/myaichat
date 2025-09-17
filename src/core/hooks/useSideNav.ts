import { SideNavService } from "core/services/SideNavService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

const sideNavService = SideNavService();

export const useSideNav = () => {
  const { chatsSummary } = useAppStore();
  const { setChatsSummary } = useAppStoreActions();

  const getChatsSummary = async () => {
    const res = await sideNavService.getChatSummary();
    setChatsSummary(res?.chats || []);
  };

  const toggleFavorite = async (chatId: string) => {
    const currentChat = chatsSummary.find(chat => chat.id === chatId);
    if (!currentChat) return;
    const optimisticUpdate = chatsSummary.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, fav: !chat.fav };
      }
      return chat;
    });
    setChatsSummary(optimisticUpdate);

    try {
      await sideNavService.toggleFavorite(chatId);
    } catch (error) {
      setChatsSummary(chatsSummary);
      throw error;
    }
  };

  return { chatsSummary, getChatsSummary, toggleFavorite };
};
