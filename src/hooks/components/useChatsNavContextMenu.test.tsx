import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChatsNavContextMenu } from "./useChatsNavContextMenu";
import { ChatSummary } from "types/chat/ChatSummary.type";

// Mock the icon components
vi.mock("assets/icons/PencilIcon", () => ({
  PencilIcon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="pencil-icon" />
  ),
}));

vi.mock("assets/icons/TrashIcon", () => ({
  TrashIcon: ({ className }: { className?: string }) => (
    <div className={className} data-testid="trash-icon" />
  ),
}));

type ReactElementProps = {
  onClick: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  "aria-label": string;
};

describe("useChatsNavContextMenu", () => {
  const mockSetIsContextMenuOpen = vi.fn();
  const mockHandleRenameModal = vi.fn();
  const mockHandleDeleteChat = vi.fn();

  const mockChat: ChatSummary = {
    id: "chat-1",
    title: "Test Chat",
    fav: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty elements array", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    expect(result.current.elements).toEqual([]);
  });

  it("should update elements with delete and rename buttons", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    act(() => {
      result.current.updateElements({
        chat: mockChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    expect(result.current.elements).toHaveLength(2);
  });

  it("should call handleDeleteChat and setIsContextMenuOpen when delete button is clicked", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    act(() => {
      result.current.updateElements({
        chat: mockChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    const deleteButton = result.current.elements[0] as React.ReactElement<ReactElementProps>;

    act(() => {
      deleteButton.props.onClick();
    });

    expect(mockHandleDeleteChat).toHaveBeenCalledWith("chat-1");
    expect(mockSetIsContextMenuOpen).toHaveBeenCalledWith(false);
  });

  it("should call handleRenameModal when rename button is clicked", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    act(() => {
      result.current.updateElements({
        chat: mockChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    const renameButton = result.current.elements[1] as React.ReactElement<ReactElementProps>;

    act(() => {
      renameButton.props.onClick();
    });

    expect(mockHandleRenameModal).toHaveBeenCalledWith("chat-1");
  });

  it("should prevent default on context menu for delete button", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    act(() => {
      result.current.updateElements({
        chat: mockChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    const deleteButton = result.current.elements[0] as React.ReactElement<ReactElementProps>;
    const mockEvent = { preventDefault: vi.fn() };

    act(() => {
      deleteButton.props.onContextMenu(mockEvent as unknown as React.MouseEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it("should set correct aria-label for delete button with chat title", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    act(() => {
      result.current.updateElements({
        chat: mockChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    const deleteButton = result.current.elements[0] as React.ReactElement<ReactElementProps>;

    expect(deleteButton.props["aria-label"]).toBe("Delete chat: Test Chat");
  });

  it("should update elements multiple times correctly", () => {
    const { result } = renderHook(() =>
      useChatsNavContextMenu({ setIsContextMenuOpen: mockSetIsContextMenuOpen })
    );

    const firstChat: ChatSummary = {
      ...mockChat,
      id: "chat-1",
      title: "First Chat",
    };
    const secondChat: ChatSummary = {
      ...mockChat,
      id: "chat-2",
      title: "Second Chat",
    };

    act(() => {
      result.current.updateElements({
        chat: firstChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    expect(result.current.elements).toHaveLength(2);

    act(() => {
      result.current.updateElements({
        chat: secondChat,
        handleRenameModal: mockHandleRenameModal,
        handleDeleteChat: mockHandleDeleteChat,
      });
    });

    expect(result.current.elements).toHaveLength(2);
    const deleteButton = result.current.elements[0] as React.ReactElement<ReactElementProps>;
    expect(deleteButton.props["aria-label"]).toBe("Delete chat: Second Chat");
  });
});
