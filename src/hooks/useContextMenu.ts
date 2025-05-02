import React from "react";

export const useContextMenu = () => {
  const onTouchStart = (
    e: React.TouchEvent<HTMLElement>,
    callback: () => void
  ) => {
    const timeout = setTimeout(() => {
      callback();
    }, 500); // 500ms for long press
    (e.target as HTMLElement).dataset.longPressTimeout = String(timeout);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    clearTimeout(Number((e.target as HTMLElement).dataset.longPressTimeout));
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
};
