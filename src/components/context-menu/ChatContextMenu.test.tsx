import React from "react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatContextMenu } from "./ChatContextMenu";
import * as ChatHook from "core/hooks/useChatContext";

// Mock the portal container that component expects
beforeEach(() => {
  const container = document.createElement("div");
  container.setAttribute("id", "context-menu-container");
  document.body.appendChild(container);
  // default spy for useChatContext to avoid real hook behavior (useNavigate)
  vi.spyOn(ChatHook, "useChatContext").mockReturnValue({
    deleteChat: vi.fn(),
    renameChat: vi.fn(),
  });
});

afterEach(() => {
  const container = document.getElementById("context-menu-container");
  if (container && container.parentNode)
    container.parentNode.removeChild(container);
  vi.clearAllMocks();
});

describe("ChatContextMenu", () => {
  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof ChatContextMenu>>
  ) => {
    const defaultProps: React.ComponentProps<typeof ChatContextMenu> = {
      isContextMenuOpen: true,
      setIsContextMenuOpen: vi.fn(),
      onRename: vi.fn(),
      contextMetadata: { x: 10, y: 10 },
      chat: { id: "chat-1", title: "Test Chat", fav: false },
      parentRef: { current: null } as unknown as React.RefObject<HTMLLIElement>,
    };

    return render(<ChatContextMenu {...defaultProps} {...props} />);
  };
  it("calls deleteChat from context when Delete is clicked and closes menu", async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    // spy on the hook to return our mock
    vi.spyOn(ChatHook, "useChatContext").mockReturnValue({
      deleteChat: mockDelete,
      renameChat: vi.fn(),
    });

    const setIsContextMenuOpen = vi.fn();
    renderComponent({ setIsContextMenuOpen });

    const deleteItem = screen.getByText("Delete");
    await userEvent.click(deleteItem);

    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith("chat-1"));
    expect(setIsContextMenuOpen).toHaveBeenCalledWith(false);
  });

  it("calls onRename prop when Rename clicked and closes menu", async () => {
    const onRename = vi.fn();
    const setIsContextMenuOpen = vi.fn();
    renderComponent({ onRename, setIsContextMenuOpen });

    const renameItem = screen.getByText("Rename");
    await userEvent.click(renameItem);

    expect(onRename).toHaveBeenCalledWith("chat-1");
    expect(setIsContextMenuOpen).toHaveBeenCalledWith(false);
  });

  it("closes when clicking outside the menu but not when clicking parentRef", async () => {
    const setIsContextMenuOpen = vi.fn();

    // Create a parent element and pass its ref
    const parent = document.createElement("li");
    document.body.appendChild(parent);
    const parentRef = { current: parent } as React.RefObject<HTMLLIElement>;

    renderComponent({ setIsContextMenuOpen, parentRef });

    // Click inside parentRef should NOT close
    await userEvent.click(parent);
    expect(setIsContextMenuOpen).not.toHaveBeenCalled();

    // Click outside should close
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    await userEvent.click(outside);
    // give event loop a tick for handler
    await waitFor(() =>
      expect(setIsContextMenuOpen).toHaveBeenCalledWith(false)
    );

    // cleanup appended elements
    if (parent.parentNode) parent.parentNode.removeChild(parent);
    if (outside.parentNode) outside.parentNode.removeChild(outside);
  });
});
