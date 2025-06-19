/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatItem } from "./ChatItem";
import { useParams } from "react-router";
import { ChatSummary } from "types/chat/ChatSummary.type";

// Mock dependencies
vi.mock("react-router", () => ({
  Link: ({ to, children, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useParams: vi.fn(),
}));
vi.mock("./FavChat", () => ({
  FavChat: ({ fav }: any) => (
    <div data-testid="fav-chat">{fav ? "★" : "☆"}</div>
  ),
}));

const mockChat = {
  id: "123",
  title: "Test Chat",
  fav: true,
};

describe("ChatItem", () => {
  const handleRedirectToChatOnMobile = vi.fn();
  const handleContextMenu = vi.fn(() => vi.fn());
  const handleContextMenuOnTouch = vi.fn(() => vi.fn());
  const onTouchEnd = vi.fn();
  const mockUseParams = vi.mocked(useParams);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (chat?: ChatSummary) => {
    return render(
      <ChatItem
        chat={chat || mockChat}
        handleRedirectToChatOnMobile={handleRedirectToChatOnMobile}
        handleContextMenu={handleContextMenu}
        handleContextMenuOnTouch={handleContextMenuOnTouch}
        onTouchEnd={onTouchEnd}
      />
    );
  };

  it("renders chat title and fav icon", () => {
    mockUseParams.mockReturnValue({ id: undefined });
    renderComponent();
    expect(screen.getByText("Test Chat")).toBeInTheDocument();
    expect(screen.getByTestId("fav-chat")).toHaveTextContent("★");
  });

  it("applies font-bold class when chat is selected", () => {
    mockUseParams.mockReturnValue({ id: "123" });
    renderComponent();
    const link = screen.getByText("Test Chat");
    expect(link.className).toContain("font-bold");
  });

  it("calls handleRedirectToChatOnMobile on click", () => {
    mockUseParams.mockReturnValue({ id: undefined });
    renderComponent();
    fireEvent.click(screen.getByText("Test Chat"));
    expect(handleRedirectToChatOnMobile).toHaveBeenCalled();
  });

  it("calls handleContextMenu on context menu", () => {
    mockUseParams.mockReturnValue({ id: undefined });
    const contextMenuHandler = vi.fn();
    handleContextMenu.mockReturnValue(contextMenuHandler);
    renderComponent();
    fireEvent.contextMenu(screen.getByText("Test Chat"));
    expect(handleContextMenu).toHaveBeenCalledWith(mockChat);
    expect(contextMenuHandler).toHaveBeenCalled();
  });

  it("calls handleContextMenuOnTouch on touch start", () => {
    mockUseParams.mockReturnValue({ id: undefined });
    const touchStartHandler = vi.fn();
    handleContextMenuOnTouch.mockReturnValue(touchStartHandler);
    renderComponent();
    fireEvent.touchStart(screen.getByText("Test Chat"));
    expect(handleContextMenuOnTouch).toHaveBeenCalledWith(mockChat);
    expect(touchStartHandler).toHaveBeenCalled();
  });

  it("calls onTouchEnd on touch end", () => {
    mockUseParams.mockReturnValue({ id: undefined });
    renderComponent();
    fireEvent.touchEnd(screen.getByText("Test Chat"));
    expect(onTouchEnd).toHaveBeenCalled();
  });

  it("renders unfavored chat correctly", () => {
    mockUseParams.mockReturnValue({ id: undefined });
    renderComponent({ ...mockChat, fav: false });
    expect(screen.getByTestId("fav-chat")).toHaveTextContent("☆");
  });
});
