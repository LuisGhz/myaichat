import { create } from "zustand";
import { AppStoreProps } from "types/store/AppStore";

export const useZustandAppStore = create<AppStoreProps>((set) => ({
  chats: [],
  isMenuOpen: true,
  isOffline: false,
  setChats: (chats) => set({ chats }),
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
}));
