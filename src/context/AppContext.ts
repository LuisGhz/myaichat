import { createContext } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

type AppContextProps = {
  chats: ChatSummary[];
  getAllChatsForList: () => void;
  deleteChatById: (id: string) => void;
};

export const AppContext = createContext<AppContextProps>({
  chats: [],
  getAllChatsForList: () => {},
  deleteChatById: () => {},
});
