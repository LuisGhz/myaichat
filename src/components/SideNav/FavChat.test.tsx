/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavChat } from "./FavChat";

// Mock Star icons
vi.mock("assets/icons/StarIcon", () => ({
  StarIcon: ({ className, onClick }: any) => (
    <svg data-testid="star-icon" className={className} onClick={onClick} />
  ),
}));
vi.mock("assets/icons/StarSolidIcon", () => ({
  StarIconSolid: ({ className, onClick }: any) => (
    <svg data-testid="star-solid-icon" className={className} onClick={onClick} />
  ),
}));

// Mock hooks
const mockToggleChatFav = vi.fn();
const mockUpdateChatFav = vi.fn();
vi.mock("hooks/features/Chat/useChats", () => ({
  useChats: () => ({ toggleChatFav: mockToggleChatFav }),
}));
vi.mock("store/useAppStore", () => ({
  useAppStoreUpdateChatFav: () => mockUpdateChatFav,
}));

describe("FavChat", () => {
  const mockId = "chat-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent(props = { id: mockId, fav: false }) {
    return render(<FavChat {...props} />);
  }

  it("renders StarIcon when fav is false", () => {
    renderComponent({ id: mockId, fav: false });
    expect(screen.getByTestId("star-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("star-solid-icon")).not.toBeInTheDocument();
  });

  it("renders StarIconSolid when fav is true", () => {
    renderComponent({ id: mockId, fav: true });
    expect(screen.getByTestId("star-solid-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("star-icon")).not.toBeInTheDocument();
  });

  it("calls toggleChatFav and updateChatFav on click (fav false)", async () => {
    mockToggleChatFav.mockResolvedValue(undefined);
    renderComponent({ id: mockId, fav: false });
    await userEvent.click(screen.getByTestId("star-icon"));
    expect(mockToggleChatFav).toHaveBeenCalledWith(mockId);
    expect(mockUpdateChatFav).toHaveBeenCalledWith(mockId, true);
  });

  it("calls toggleChatFav and updateChatFav on click (fav true)", async () => {
    mockToggleChatFav.mockResolvedValue(undefined);
    renderComponent({ id: mockId, fav: true });
    await userEvent.click(screen.getByTestId("star-solid-icon"));
    expect(mockToggleChatFav).toHaveBeenCalledWith(mockId);
    expect(mockUpdateChatFav).toHaveBeenCalledWith(mockId, false);
  });

  it("logs error if toggleChatFav throws", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockToggleChatFav.mockRejectedValue(new Error("fail"));
    renderComponent({ id: mockId, fav: false });
    await userEvent.click(screen.getByTestId("star-icon"));
    expect(errorSpy).toHaveBeenCalledWith("Error toggling favorite chat status");
    errorSpy.mockRestore();
  });

  it("has accessible clickable icons", () => {
    renderComponent({ id: mockId, fav: false });
    const icon = screen.getByTestId("star-icon");
    expect(icon).toHaveClass("cursor-pointer");
  });
});
