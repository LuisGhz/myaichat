import { createPortal } from "react-dom";
import { TrashOutlineIcon } from "icons/TrashOutlineIcon";
import { Pencil } from "icons/PencilIcon";

type Props = {
  isContextMenuOpen: boolean;
};

export const ChatContextMenu = ({ isContextMenuOpen }: Props) => {
  if (!isContextMenuOpen) return null;

  return createPortal(
    <ul className="absolute top-0 left-0 bg-gray-200 rounded-sm dark:bg-gray-950 dark:text-white z-50 w-32">
      <li className="px-4 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex justify-between items-center">
        <span>Delete</span>
        <TrashOutlineIcon className="inline-block w-4 h-4 ms-2" />
      </li>
      <li className="px-4 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex justify-between items-center">
        <span>Rename</span>
        <Pencil className="inline-block w-4 h-4 ms-2" />
      </li>
    </ul>,
    document.querySelector("#context-menu-container")!
  );
};
