import React, { useEffect, useState } from "react";

export const useChatsNavContextMenu = () => {
  const [currentContextMenu, setCurrentContextMenu] = useState<string>("");
  const [contextMenuTop, setContextMenuTop] = useState<number>(0);
  const [contextMenuLeft, setContextMenuLeft] = useState<number>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        const isContextMenu = event.target.closest(".context-menu");
        if (!isContextMenu) setCurrentContextMenu("");
      }
    };

    const handleContextMenuOutside = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        // Check if the right-click target is the link that opened the current menu
        const linkElement = event.target.closest(
          `a[href="/chat/${currentContextMenu}"]`
        );
        // Check if the right-click target is inside the currently open context menu
        const isContextMenu = event.target.closest(".context-menu");

        // If the right-click is neither on the link that opened the menu nor inside the menu itself, close it.
        if (!linkElement && !isContextMenu) {
          setCurrentContextMenu("");
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleContextMenuOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("contextmenu", handleContextMenuOutside);
    };
  }, [currentContextMenu]);

  const onContextMenu = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    setContextMenuTop(e.pageY);
    setContextMenuLeft(e.pageX);
    setCurrentContextMenu(() => id);
  };

  const onTouchStart = (e: React.TouchEvent<HTMLElement>, id: string) => {
    const timeout = setTimeout(() => {
      setContextMenuTop(e.touches[0].pageY);
      setContextMenuLeft(e.touches[0].pageX);
      setCurrentContextMenu(() => id);
    }, 500); // 500ms for long press
    (e.target as HTMLElement).dataset.longPressTimeout = String(timeout);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    clearTimeout(Number((e.target as HTMLElement).dataset.longPressTimeout));
  };

  const closeContextMenu = () => {
    setCurrentContextMenu("");
    setContextMenuTop(0);
    setContextMenuLeft(0);
  };

  return {
    currentContextMenu,
    setCurrentContextMenu,
    contextMenuTop,
    setContextMenuTop,
    contextMenuLeft,
    setContextMenuLeft,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    closeContextMenu,
  };
};
