import { createContext } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

type AppContextProps = {
  chats: ChatSummary[];
  getAllChatsForList: () => void;
};

export const AppContext = createContext<AppContextProps>({
  chats: [],
  getAllChatsForList: () => {},
});
