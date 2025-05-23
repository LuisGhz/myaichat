import { ReactNode, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { ChatSummary } from "types/chat/ChatSummary.type";
import { useChats } from "hooks/useChats";

type Props = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: Props) => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const { getAllChats, deleteChat } = useChats();

  useEffect(() => {
    getAllChatsForList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllChatsForList = async () => {
    const ch = await getAllChats();
    setChats(ch.reverse());
  };

  const deleteChatById = async (id: string) => {
    await deleteChat(id);
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);
  };

  return (
    <AppContext.Provider
      value={{
        chats,
        getAllChatsForList,
        deleteChatById,
        isMenuOpen,
        setIsMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
