import { useChats } from "hooks/useChats";
import { useEffect, useState } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

export const ChatsList = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const { getAllChats } = useChats();

  useEffect(() => {
    (async () => {
      const res = await getAllChats();
      const ch = res?.chats || [] as ChatSummary[];
      setChats(ch);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (<>
    <ul>
      <li>Bienvenido</li>
      <li>New chat</li>
      {chats.length > 0 &&
        chats.map(chat => (<li>{chat.title}</li>))
      }
    </ul>
  </>);
};