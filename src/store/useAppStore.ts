import { useZustandAppStore } from "./useZustandAppStore";

export const useAppChatsStore = () => useZustandAppStore((state) => state.chats);
export const useAppIsMenuOpenStore = () => useZustandAppStore((state) => state.isMenuOpen);
export const useAppIsOfflineStore = () => useZustandAppStore((state) => state.isOffline);
export const useAppSetChatsStore = () => useZustandAppStore((state) => state.setChats);
export const useAppDeleteChatByIdStore = () => useZustandAppStore((state) => state.deleteChatById);
export const useAppAddChatStore = () => useZustandAppStore((state) => state.addChat);
export const useAppSetIsMenuOpenStore = () => useZustandAppStore((state) => state.setIsMenuOpen);
export const useAppUpdateIsOfflineStore = () => useZustandAppStore((state) => state.updateIsOffline);