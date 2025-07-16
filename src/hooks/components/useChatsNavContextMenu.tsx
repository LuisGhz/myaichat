import { PencilIcon } from "assets/icons/PencilIcon";
import { TrashIcon } from "assets/icons/TrashIcon";
import { useState, ReactNode, Dispatch, SetStateAction } from "react";
import { ChatSummary } from "types/chat/ChatSummary.type";

type Props = {
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>;
};

type UpdateElementsProps = {
  chat: ChatSummary;
  handleRenameModal: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void;
};

export const useChatsNavContextMenu = ({ setIsContextMenuOpen }: Props) => {
  const [elements, setElements] = useState<ReactNode[]>([]);  

  const updateElements = ({
    chat,
    handleRenameModal,
    handleDeleteChat,
  }: UpdateElementsProps) => {
    setElements([
      <button
        className="cursor-pointer w-full text-red-700 flex gap-2"
        type="button"
        aria-label={`Delete chat: ${chat.title}`}
        onClick={() => {
          handleDeleteChat(chat.id);
          setIsContextMenuOpen(false);
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <TrashIcon className="w-5 min-w-5" />
        <span>Delete</span>
      </button>,
      <button
        className="cursor-pointer w-full text-white flex gap-2"
        type="button"
        aria-label="Rename chat"
        onClick={() => handleRenameModal(chat.id)}
      >
        <PencilIcon className="w-5 min-w-5" />
        <span>Rename</span>
      </button>,
    ]);
  };

  return {
    elements,
    updateElements,
  };
};
