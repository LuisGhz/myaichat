import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Link } from "react-router";

export const ChatsList = () => {
  const { chats } = useContext(AppContext);

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