import { ChatSummary } from "types/chat/ChatSummary.type";

export type AppStoreProps = {
  chats: ChatSummary[];
  setChats: (chats: ChatSummary[]) => void;
  deleteChatById: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  updateChatFav: (id: string, fav: boolean) => void;
  addChat: (chat: ChatSummary) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isOffline: boolean;
  updateIsOffline: (isOffline: boolean) => void;
};
