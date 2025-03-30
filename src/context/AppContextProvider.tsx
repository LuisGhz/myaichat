import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { ChatSummary } from "types/chat/ChatSummary.type";
import { useChats } from "hooks/useChats";

type Props = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: Props) => {
  const [chats, setChats] = useState<ChatSummary[]>([]);

  const { getAllChats } = useChats();

  useEffect(() => {
    getAllChatsForList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllChatsForList = async () => {
    const ch = await getAllChats();
    setChats(ch.reverse());
  };

  return (
    <AppContext.Provider value={{ chats, getAllChatsForList }}>
      {children}
    </AppContext.Provider>
  );
};
