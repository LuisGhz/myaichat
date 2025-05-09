import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatsContextMenu } from "./ChatsContextMenu";
import { createPortal } from "react-dom";
import { ChatSummary } from "types/chat/ChatSummary.type";

// Mock createPortal
vi.mock("react-dom", () => ({
  createPortal: vi.fn((element: React.ReactNode) => element),
}));

// Mock Assets
vi.mock("assets/icons/TrashIcon", () => ({
  TrashIcon: () => <div data-testid="trash-icon">TrashIcon</div>,
}));

vi.mock("assets/icons/PencilIcon", () => ({
  PencilIcon: () => <div data-testid="pencil-icon">PencilIcon</div>,
}));

describe("ChatsContextMenu", () => {
  const mockChat = {
    id: "123",
    title: "Test Chat",
  } as ChatSummary;
  const mockHandleDeleteChat = vi.fn();
  const mockHandleRenameChat = vi.fn();

  const renderComponent = (
    currentContextMenu: string = "",
    top: number = 0,
    left: number = 0
  ) => {
    render(
      <ChatsContextMenu
        chat={mockChat}
        currentContextMenu={currentContextMenu}
        top={top}
        left={left}
        handleDeleteChat={mockHandleDeleteChat}
        handleRenameChat={mockHandleRenameChat}
      />
    );
  };

  it("should render the component and display the menu when currentContextMenu matches chat.id", () => {
    renderComponent(mockChat.id, 10, 20);
    const menu = screen.getByRole("list");
    expect(menu).toBeVisible();
    expect(menu).toHaveClass("block!");
  });

  it("should render the component and hide the menu when currentContextMenu does not match chat.id", () => {
    renderComponent("different-id", 10, 20);
    const menu = screen.getByRole("list");
    expect(menu).not.toHaveClass("block!");
  });

  it("should call handleDeleteChat when the delete button is clicked", async () => {
    renderComponent(mockChat.id, 10, 20);
    const deleteButton = screen.getByRole("button", {
      name: `Delete chat: ${mockChat.title}`,
    });
    await userEvent.click(deleteButton);
    expect(mockHandleDeleteChat).toHaveBeenCalledWith(mockChat.id);
  });

  it("should call handleRenameChat when the rename button is clicked", async () => {
    renderComponent(mockChat.id, 10, 20);
    const renameButton = screen.getByRole("button", { name: "Rename chat" });
    await userEvent.click(renameButton);
    expect(mockHandleRenameChat).toHaveBeenCalledWith(mockChat.id);
  });

  it("should apply the correct top and left styles when the context menu is active", () => {
    renderComponent(mockChat.id, 50, 75);
    const menu = screen.getByRole("list");
    expect(menu).toHaveStyle("top: 50px");
    expect(menu).toHaveStyle("left: 75px");
  });

  it("should apply default top and left styles when the context menu is inactive", () => {
    renderComponent("different-id", 50, 75);
    const menu = screen.getByRole("list");
    expect(menu).toHaveStyle("top: 0px");
    expect(menu).toHaveStyle("left: 0px");
  });

  it("should render the TrashIcon component", () => {
    renderComponent(mockChat.id, 10, 20);
    const trashIcon = screen.getByTestId("trash-icon");
    expect(trashIcon).toBeInTheDocument();
  });

  it("should render the PencilIcon component", () => {
    renderComponent(mockChat.id, 10, 20);
    const pencilIcon = screen.getByTestId("pencil-icon");
    expect(pencilIcon).toBeInTheDocument();
  });

  it("should render the component inside a portal", () => {
    renderComponent(mockChat.id, 10, 20);
    expect(createPortal).toHaveBeenCalled();
  });
});