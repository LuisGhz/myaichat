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
    await sideNavService.toggleFavorite(chatId);
    const temp = chatsSummary.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, fav: !chat.fav };
      }
      return chat;
    });
    setChatsSummary(temp);
  };

  return { chatsSummary, getChatsSummary, toggleFavorite };
};
