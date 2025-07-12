import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatTitle } from "./ChatTitle";
import * as appStore from "store/useAppStore";

const mockUseParams = vi.fn();
vi.mock("react-router", () => ({
  useParams: () => mockUseParams(),
}));

// Mock store and router
describe("ChatTitle", () => {
  type Chat = { id: string; title: string; fav: boolean };
  let mockChats: Chat[];
  const mockChatId = "123";
  const mockChatTitle = "Test Chat Title";

  beforeEach(() => {
    mockChats = [
      { id: mockChatId, title: mockChatTitle, fav: false },
      { id: "456", title: "Another Chat", fav: true },
    ];
    mockUseParams.mockReturnValue({ id: mockChatId });
    vi.spyOn(appStore, "useAppChatsStore").mockReturnValue(mockChats);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function renderComponent() {
    return render(<ChatTitle />);
  }

  it("renders the chat title when chat is found", () => {
    renderComponent();
    // Should display the correct chat title
    expect(
      screen.getByRole("heading", { level: 3, name: mockChatTitle })
    ).toBeInTheDocument();
  });

  it("renders nothing if chat is not found", () => {
    mockUseParams.mockReturnValue({ id: "notfound" });
    renderComponent();
    // Should not render any heading
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("truncates long chat titles for accessibility", () => {
    const longTitle = "A".repeat(100);
    mockChats[0].title = longTitle;
    renderComponent();
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent(longTitle);
    // Check for truncate class for accessibility
    expect(heading.className).toMatch(/truncate/);
  });

  // No user interaction, but test user flow for future-proofing
  it("does not respond to user events (static)", async () => {
    renderComponent();
    await userEvent.click(screen.getByRole("heading", { level: 3 }));
    // No state change expected
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      mockChatTitle
    );
  });
});
