import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { v1 } from "uuid";

type Props = {
  elements: ReactNode[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggered?: HTMLElement;
  customClass?: string;
};

export const ContextMenu = ({
  elements,
  isOpen,
  setIsOpen,
  triggered,
  customClass,
}: Props) => {
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [uuid, setUuid] = useState<string>(`context-menu-${v1()}`);
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const uuid = v1().split("-")[0];
    const className = `context-menu-${uuid}`;
    if (ulRef.current) {
      setUuid(className);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTop(0);
      setLeft(0);
      return;
    }
    const handleContextMenu = (event: MouseEvent) => {
      const additionalOffset = 10;
      let top = event.pageY;
      if (window.innerHeight < event.pageY + ulRef.current!.clientHeight)
        top =
          window.innerHeight - (ulRef.current!.clientHeight + additionalOffset);
      setTop(top);
      let left = event.pageX;
      if (window.innerWidth < event.pageX + ulRef.current!.clientWidth)
        left =
          window.innerWidth - (ulRef.current!.clientWidth + additionalOffset);
      setLeft(left);
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        const isContextMenu = event.target.closest(uuid);
        const isTriggeredElement = triggered?.contains(event.target);
        if (!isContextMenu && !isTriggeredElement) setIsOpen(false);
      }
    };

    const handleContextMenuOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        // Check if the right-click target is inside the currently open context menu
        const isContextMenu = event.target.closest(uuid);
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
  }, [setIsOpen, triggered, uuid]);

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <ul
      className={`${uuid} ${
        customClass ? customClass : ""
      } absolute w-36 h-auto z-20 bg-cop-5 hidden rounded-sm ${
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
