import { createContext, Dispatch, SetStateAction } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

export type AppContextProps = {
  chats: ChatSummary[];
  getAllChatsForList: () => void;
  deleteChatById: (id: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  isOffline: boolean;
};

export const AppContext = createContext<AppContextProps>({
  chats: [],
  getAllChatsForList: () => {},
  deleteChatById: () => {},
  isMenuOpen: true,
  setIsMenuOpen: () => {},
  isOffline: false,
});
