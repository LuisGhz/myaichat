import { useChats } from "hooks/useChats";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChatSummary } from "types/chat/ChatSummary.type";

export const ChatsList = () => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const { getAllChats } = useChats();

  useEffect(() => {
    (async () => {
      const chatRes = await getAllChats();
      setChats(chatRes);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<>
    <ul className="bg-menu text-white h-full">
      <li><Link to={'/'}>Bienvenido</Link></li>
      <li><Link to={'/chat'}>New chat</Link></li>
      {chats.length > 0 &&
        chats.map(chat => (<li key={chat.id}><Link to={`/chat/${chat.id}`}>{chat.title}</Link></li>))
      }
    </ul>
  </>);
};