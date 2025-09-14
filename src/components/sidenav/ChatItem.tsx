import { FavoriteFilledIcon } from "icons/FavoriteFilledIcon";
import { Chat } from "./ChatsList";
import { FavoriteIcon } from "icons/FavoriteIcon";
import { useRef } from "react";

type Props = {
  chat: Chat;
  onContextMenu: (chatId: string) => (e: React.MouseEvent) => void;
};

export const ChatItem = ({ chat, onContextMenu }: Props) => {
  const parentRef = useRef<HTMLLIElement | null>(null);

  return (
    <li
      className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between gap-2"
      onContextMenu={onContextMenu(chat.id)}
      ref={parentRef}
    >
      <span className="dark:text-gray-200 grow ps-2 py-1.5">{chat.title}</span>
      {chat.isFav ? (
        <button className="pe-2" aria-label="Mark as unfavorite">
          <FavoriteFilledIcon className="text-yellow-500 cursor-pointer w-5 h-5" />
        </button>
      ) : (
        <button className="pe-2" aria-label="Mark as favorite">
          <FavoriteIcon className="dark:text-gray-200 cursor-pointer w-5 h-5" />
        </button>
      )}
    </li>
  );
};
