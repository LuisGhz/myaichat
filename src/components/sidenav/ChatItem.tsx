import { useRef } from "react";
import { Link } from "react-router";
import { FavoriteFilledIcon } from "icons/FavoriteFilledIcon";
import { FavoriteIcon } from "icons/FavoriteIcon";
import { useSideNav } from "core/hooks/useSideNav";
import { useChatParams } from "features/Chat/hooks/useChatParams";

type Props = {
  chat: ChatSummary;
  onContextMenu: (chatId: string) => (e: React.MouseEvent) => void;
};

export const ChatItem = ({ chat, onContextMenu }: Props) => {
  const { toggleFavorite } = useSideNav();
  const parentRef = useRef<HTMLLIElement | null>(null);
  const params = useChatParams();

  const handleToggleFavorite = async () => {
    await toggleFavorite(chat.id);
  };

  return (
    <li
      className={`hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer flex items-center ${
        !chat.title ? "justify-end" : "justify-between"
      } gap-2 text-black dark:text-gray-200 transition-colors duration-200`}
      onContextMenu={onContextMenu(chat.id)}
      ref={parentRef}
    >
      {chat.title && (
        <>
          <Link
            className={`grow ps-2 py-2 no-underline hover:underline text-inherit ${
              params.id === chat.id ? "font-semibold" : ""
            }`}
            to={`/chat/${chat.id}`}
            title={chat.title}
          >
            {chat.title}
          </Link>
          {chat.fav ? (
            <button
              className="pe-2"
              aria-label="Mark as unfavorite"
              onClick={handleToggleFavorite}
            >
              <FavoriteFilledIcon className="text-yellow-500 cursor-pointer w-5 h-5" />
            </button>
          ) : (
            <button
              className="pe-2"
              aria-label="Mark as favorite"
              onClick={handleToggleFavorite}
            >
              <FavoriteIcon className="dark:text-gray-200 cursor-pointer w-5 h-5" />
            </button>
          )}
        </>
      )}
    </li>
  );
};
