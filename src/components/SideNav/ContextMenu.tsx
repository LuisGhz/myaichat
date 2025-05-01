import { TrashIcon } from "assets/icons/TrashIcon";
import { ChatSummary } from "types/chat/ChatSummary.type";

type Props = {
  chat: ChatSummary;
  currentContextMenu: string;
  top: number;
  left: number;
  handleDeleteChat: (id: string) => void;
};

export const ContextMenu = ({
  chat,
  handleDeleteChat,
  currentContextMenu,
  top,
  left,
}: Props) => {
  return (
    <ul
      className={`context-menu absolute w-36 h-auto z-50 bg-cop-5 hidden rounded-sm ${
        currentContextMenu === chat.id ? "block!" : ""
      }`}
      style={{
        top: `${chat.id === currentContextMenu ? top : 0}px`,
        left: `${chat.id === currentContextMenu ? left : 0}px`,
      }}
    >
      <li className="hover:bg-cop-10 transition-colors duration-300 ps-2 py-1">
        <button
          className="cursor-pointer w-full text-red-700 flex gap-2"
          type="button"
          aria-label={`Delete chat: ${chat.title}`}
          onClick={() => handleDeleteChat(chat.id)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <TrashIcon className="w-5 min-w-5" />
          <span>Delete</span>
        </button>
      </li>
    </ul>
  );
};
