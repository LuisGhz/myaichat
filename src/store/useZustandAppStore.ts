import { create } from "zustand";
import { AppStoreProps } from "types/store/AppStore";

export const useZustandAppStore = create<AppStoreProps>((set) => ({
  chats: [],
  isMenuOpen: true,
  isOffline: false,
  setChats: (chats) => set({ chats }),
  updateChatTitle: (id: string, title: string) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      ),
    }));
  },
  updateChatFav: (id: string, fav: boolean) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, fav } : chat
      ),
    }));
  },
  deleteChatById: (id: string) => {
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
    }));
  },
  addChat: (chat) => {
    set((state) => ({
      chats: [chat, ...state.chats],
    }));
  },
  setIsMenuOpen: (isOpen) => set({ isMenuOpen: isOpen }),
  updateIsOffline: (isOffline) => set({ isOffline }),
}));
