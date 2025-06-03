import { ChatSummary } from "types/chat/ChatSummary.type";

export type AppStoreProps = {
  chats: ChatSummary[];
  setChats: (chats: ChatSummary[]) => void;
  deleteChatById: (id: string) => void;
  addChat: (chat: ChatSummary) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isOffline: boolean;
};
