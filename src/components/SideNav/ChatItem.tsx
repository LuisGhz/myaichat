import { Link, useParams } from "react-router";
import { FavChat } from "./FavChat";
import { ChatSummary } from "types/chat/ChatSummary.type";

type Props = {
  chat: ChatSummary;
  handleRedirectToChatOnMobile?: () => void;
  handleContextMenu: (
    chat: ChatSummary
  ) => (e: React.MouseEvent<HTMLElement>) => void;
  handleContextMenuOnTouch: (
    chat: ChatSummary
  ) => (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLElement>) => void;
};

export const ChatItem = ({
  chat,
  handleRedirectToChatOnMobile,
  handleContextMenu,
  handleContextMenuOnTouch,
  onTouchEnd,
}: Props) => {
  const params = useParams<{ id?: string }>();

  return (
    <li
      className="my-3 hover:bg-cop-6 transition-colors duration-300 rounded-lg flex justify-between"
      key={chat.id}
      title={chat.title}
    >
      <Link
        to={`/chat/${chat.id}`}
        className={`block whitespace-nowrap overflow-hidden text-ellipsis w-full h-11 px-2 py-2 ${
          chat.id === params.id ? "font-bold" : ""
        }`}
        aria-label={`Open chat: ${chat.title}`}
        onClick={handleRedirectToChatOnMobile}
        onContextMenu={handleContextMenu(chat)}
        onTouchStart={handleContextMenuOnTouch(chat)}
        onTouchEnd={onTouchEnd}
      >
        {chat.title}
      </Link>
      <FavChat id={chat.id} fav={chat.fav} />
    </li>
  );
};
