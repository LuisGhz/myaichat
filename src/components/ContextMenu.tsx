import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  elements: ReactNode[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggered?: HTMLElement;
};

export const ContextMenu = ({
  elements,
  isOpen,
  setIsOpen,
  triggered,
}: Props) => {
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTop(0);
      setLeft(0);
      return;
    }
    const handleContextMenu = (event: MouseEvent) => {
      setTop(event.pageY);
      setLeft(event.pageX);
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        const isContextMenu = event.target.closest(".global-context-menu");
        const isTriggeredElement = triggered?.contains(event.target);
        if (!isContextMenu && !isTriggeredElement) setIsOpen(false);
      }
    };

    const handleContextMenuOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        // Check if the right-click target is inside the currently open context menu
        const isContextMenu = event.target.closest(".global-context-menu");
        // Check if the right-click target is the element that triggered the menu
        const isTriggeredElement = triggered?.contains(event.target);
        // If the right-click is neither on the link that opened the menu nor inside the menu itself, close it.
        if (!isContextMenu && !isTriggeredElement) setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleContextMenuOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleContextMenuOutside);
    };
  }, [setIsOpen, triggered]);

  return createPortal(
    <ul
      className={`global-context-menu absolute w-36 h-auto z-20 bg-cop-5 hidden rounded-sm ${
        isOpen ? "block!" : ""
      }`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
      ref={ulRef}
    >
      {elements.length > 0 &&
        elements.map((el, idx) => (
          <li
            className="hover:bg-cop-10 transition-colors duration-300 ps-2 py-1 border-b border-cop-6"
            key={idx}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {el}
          </li>
        ))}
    </ul>,
    document.body
  );
};
