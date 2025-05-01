import { createPortal } from "react-dom";
import { TrashIcon } from "assets/icons/TrashIcon";
import { ChatSummary } from "types/chat/ChatSummary.type";
import { PencilIcon } from "assets/icons/PencilIcon";

type Props = {
  chat: ChatSummary;
  currentContextMenu: string;
  top: number;
  left: number;
  handleDeleteChat: (id: string) => void;
  handleRenameChat: (id: string) => void;
};

export const ContextMenu = ({
  chat,
  currentContextMenu,
  top,
  left,
  handleDeleteChat,
  handleRenameChat,
}: Props) => {
  return createPortal(
    <ul
      className={`context-menu absolute w-36 h-auto z-20 bg-cop-5 hidden rounded-sm ${
        currentContextMenu === chat.id ? "block!" : ""
      }`}
      style={{
        top: `${chat.id === currentContextMenu ? top : 0}px`,
        left: `${chat.id === currentContextMenu ? left : 0}px`,
      }}
    >
      <li className="hover:bg-cop-10 transition-colors duration-300 ps-2 py-1 border-b border-cop-6">
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
      <li className="hover:bg-cop-10 transition-colors duration-300 ps-2 py-1">
        <button
          className="cursor-pointer w-full text-white flex gap-2"
          type="button"
          aria-label="Rename chat"
          onClick={() => handleRenameChat(chat.id)}
        >
          <PencilIcon className="w-5 min-w-5" />
          <span>Rename</span>
        </button>
      </li>
    </ul>,
    document.body
  );
};
