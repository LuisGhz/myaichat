import { createPortal } from "react-dom";
import { TrashOutlineIcon } from "icons/TrashOutlineIcon";
import { Pencil } from "icons/PencilIcon";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from "react";

export type ContextMetadata = {
  x: number;
  y: number;
};

type Props = {
  isContextMenuOpen: boolean;
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>;
  contextMetadata: ContextMetadata;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chat: any;
  parentRef: RefObject<HTMLLIElement | null>;
};

export const ChatContextMenu = ({
  isContextMenuOpen,
  setIsContextMenuOpen,
  contextMetadata,
  parentRef,
}: Props) => {
  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!isContextMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      // If click is inside menu or inside parentRef, do nothing
      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }
      if (
        parentRef &&
        parentRef.current &&
        parentRef.current.contains(target)
      ) {
        return;
      }

      // Otherwise close the menu
      setIsContextMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isContextMenuOpen, parentRef, setIsContextMenuOpen]);

  if (!isContextMenuOpen) return null;

  const calculatedX =
    contextMetadata.x + 150 > window.innerWidth
      ? window.innerWidth - 160
      : contextMetadata.x;

  const calculatedY =
    contextMetadata.y + 100 > window.innerHeight
      ? window.innerHeight - 110
      : contextMetadata.y;

  return createPortal(
    <ul
      className={`absolute bg-gray-200 rounded-sm dark:bg-gray-950 dark:text-white z-50 w-32`}
      style={{
        top: calculatedY || -10,
        left: calculatedX || -10,
      }}
      ref={menuRef}
    >
      <li
        className="px-4 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex justify-between items-center"
        onClick={() => {
          alert("Delete action triggered");
          setIsContextMenuOpen(false);
        }}
      >
        <span>Delete</span>
        <TrashOutlineIcon className="inline-block w-4 h-4 ms-2" />
      </li>
      <li
        className="px-4 py-1.5 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer flex justify-between items-center"
        onClick={() => {
          alert("Rename action triggered");
          setIsContextMenuOpen(false);
        }}
      >
        <span>Rename</span>
        <Pencil className="inline-block w-4 h-4 ms-2" />
      </li>
    </ul>,
    document.querySelector("#context-menu-container")!
  );
};
