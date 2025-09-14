import { FavoriteFilledIcon } from "icons/FavoriteFilledIcon";
import { Chat } from "./ChatsList";
import { FavoriteIcon } from "icons/FavoriteIcon";

type Props = {
  chat: Chat;
};

export const ChatItem = ({ chat }: Props) => {
  return (
    <li className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between gap-2">
      <span className="dark:text-gray-200">{chat.title}</span>
      {chat.isFav ? (
        <button aria-label="Mark as unfavorite">
          <FavoriteFilledIcon className="text-yellow-500 cursor-pointer" />
        </button>
      ) : (
        <button aria-label="Mark as favorite">
          <FavoriteIcon className="dark:text-gray-200 cursor-pointer" />
        </button>
      )}
    </li>
  );
};
