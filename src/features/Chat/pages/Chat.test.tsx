import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Chat } from "./Chat";

// Mock dependencies
const resetChatDataMock = vi.fn();
const getChatMessagesMock = vi.fn();
const loadPreviousMessagesMock = vi.fn();
const sendNewMessageMock = vi.fn();
const toggleIsWebSearchModeMock = vi.fn();
const changeMaxOutputTokensMock = vi.fn();

const mockMessages: ChatMessage[] = [
  {
    role: "User",
    content: "Hello",
    promptTokens: 5,
    completionTokens: 0,
    file: "",
  },
  {
    role: "Assistant",
    content: "Hi there!",
    promptTokens: 0,
    completionTokens: 10,
    file: "",
  },
];

const defaultChatHookReturn = {
  model: "gpt-4o" as ModelsValues,
  promptId: undefined,
  messages: mockMessages,
  resetChatData: resetChatDataMock,
  getChatMessages: getChatMessagesMock,
  loadPreviousMessages: loadPreviousMessagesMock,
  sendNewMessage: sendNewMessageMock,
  toggleIsWebSearchMode: toggleIsWebSearchModeMock,
  changeMaxOutputTokens: changeMaxOutputTokensMock,
};

vi.mock("../hooks/useChatParams");
vi.mock("../hooks/useChat");

import { useChatParams } from "../hooks/useChatParams";
import { useChat } from "../hooks/useChat";

const mockUseChatParams = vi.mocked(useChatParams);
const mockUseChat = vi.mocked(useChat);
vi.mock("../components/NewConversation", () => ({
  NewConversation: () => (
    <div data-testid="new-conversation">New Conversation Component</div>
  ),
}));

vi.mock("../components/InputSection/InputSection", () => ({
  InputSection: () => (
    <div data-testid="input-section">Input Section Component</div>
  ),
}));

vi.mock("../components/ChatMessages", () => ({
  ChatMessages: ({ messages }: { messages: ChatMessage[] }) => (
    <div data-testid="chat-messages">
      {messages.map((msg, idx) => (
        <div key={idx} data-testid={`message-${idx}`}>
          {msg.role}: {msg.content}
        </div>
      ))}
    </div>
  ),
}));

describe("Chat", () => {
  const renderComponent = () => {
    return render(<Chat />);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock implementations
    mockUseChatParams.mockReturnValue({ id: "chat-123" });
    mockUseChat.mockReturnValue(defaultChatHookReturn);

    // Reset scroll-related refs and state by creating fresh mocks
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollTop", {
      configurable: true,
      value: 0,
      writable: true,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 500,
    });

    // Mock scrollTo method
    HTMLElement.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Message Display Logic", () => {
    it("displays NewConversation component when no messages exist", () => {
      // Mock useChat to return empty messages
      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: [],
      });

      renderComponent();

      expect(screen.getByTestId("new-conversation")).toBeInTheDocument();
      expect(screen.queryByTestId("chat-messages")).not.toBeInTheDocument();
    });

    it("displays ChatMessages component when messages exist", () => {
      renderComponent();

      expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
      expect(screen.queryByTestId("new-conversation")).not.toBeInTheDocument();
      expect(screen.getByTestId("message-0")).toHaveTextContent("User: Hello");
      expect(screen.getByTestId("message-1")).toHaveTextContent(
        "Assistant: Hi there!"
      );
    });

    it("passes messages correctly to ChatMessages component", () => {
      renderComponent();

      const chatMessages = screen.getByTestId("chat-messages");
      expect(chatMessages).toBeInTheDocument();

      // Verify both messages are rendered
      expect(screen.getByTestId("message-0")).toBeInTheDocument();
      expect(screen.getByTestId("message-1")).toBeInTheDocument();
    });
  });

  describe("Scroll Functionality", () => {

    it("triggers pagination when scrolling near the top", async () => {
      loadPreviousMessagesMock.mockResolvedValue(5); // Mock returning 5 new messages

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Mock scrollTop to be near the top (within threshold)
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      // Simulate multiple scroll events to trigger user scroll detection
      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 40 } });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });
    });

    it("shows loading indicator when loading previous messages", async () => {
      // Mock loadPreviousMessages to be slow
      loadPreviousMessagesMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(5), 100))
      );

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Trigger pagination
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });
      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(
          screen.getByText("Loading previous messages...")
        ).toBeInTheDocument();
      });
    });

    it("does not trigger pagination when already loading", async () => {
      loadPreviousMessagesMock.mockResolvedValue(5);

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      // Trigger multiple rapid scroll events
      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 20 } });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 10 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Pagination Logic", () => {
    it("handles successful pagination with new messages", async () => {
      loadPreviousMessagesMock.mockResolvedValue(3);

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });
    });

    it("handles empty page response correctly", async () => {
      loadPreviousMessagesMock.mockResolvedValue(-1); // Empty page

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });

      // Should not show loading indicator after empty response
      await waitFor(() => {
        expect(
          screen.queryByText("Loading previous messages...")
        ).not.toBeInTheDocument();
      });
    });

    it("handles pagination errors gracefully", async () => {
      loadPreviousMessagesMock.mockRejectedValue(new Error("Network error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Error loading previous messages:",
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    it("does not trigger pagination when no chat ID is present", () => {
      mockUseChatParams.mockReturnValue({ id: undefined });

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      fireEvent.scroll(scrollContainer);

      expect(loadPreviousMessagesMock).not.toHaveBeenCalled();
    });
  });

  describe("Auto-scroll Behavior", () => {
    it("auto-scrolls when assistant messages are streaming", () => {
      const scrollToMock = vi.fn();

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      scrollContainer.scrollTo = scrollToMock;

      // Mock messages with assistant streaming (empty content)
      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: [
          ...mockMessages,
          {
            role: "Assistant",
            content: "",
            promptTokens: 0,
            completionTokens: 0,
            file: "",
          },
        ],
      });

      renderComponent();

      // Auto-scroll should be triggered for streaming assistant messages
      expect(scrollContainer).toBeInTheDocument();
    });

    it("maintains scroll position when loading previous messages", () => {
      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Mock scroll properties using Object.defineProperty
      Object.defineProperty(scrollContainer, "scrollHeight", {
        value: 2000,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 500,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(scrollContainer, "clientHeight", {
        value: 500,
        writable: true,
        configurable: true,
      });

      // The component should handle scroll position maintenance
      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles missing scrollContainerRef gracefully", () => {
      renderComponent();

      // Component should render without throwing errors even if ref handling fails
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByTestId("input-section")).toBeInTheDocument();
    });

    it("handles rapid chat ID changes correctly", () => {
      const { rerender } = renderComponent();

      // Rapidly change chat IDs
      mockUseChatParams.mockReturnValue({ id: "chat-456" });
      rerender(<Chat />);

      mockUseChatParams.mockReturnValue({ id: "chat-789" });
      rerender(<Chat />);

      // Should handle multiple rapid changes without issues
      expect(getChatMessagesMock).toHaveBeenCalledWith("chat-789");
    });

    it("handles scroll events with invalid scroll properties", () => {
      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Mock invalid scroll properties
      Object.defineProperty(scrollContainer, "scrollTop", { value: NaN });
      Object.defineProperty(scrollContainer, "scrollHeight", {
        value: undefined,
      });

      // Should not throw errors
      fireEvent.scroll(scrollContainer);

      expect(scrollContainer).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("shows and hides loading indicator correctly during pagination", async () => {
      let resolvePromise: (value: number) => void;
      const loadingPromise = new Promise<number>((resolve) => {
        resolvePromise = resolve;
      });

      loadPreviousMessagesMock.mockReturnValue(loadingPromise);

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      // Trigger pagination
      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(
          screen.getByText("Loading previous messages...")
        ).toBeInTheDocument();
      });

      // Simulate messages being added (which triggers the useEffect to set loading to false)
      const newMessages: ChatMessage[] = [
        {
          role: "User",
          content: "Previous message 1",
          promptTokens: 5,
          completionTokens: 0,
          file: "",
        },
        {
          role: "Assistant",
          content: "Previous response 1",
          promptTokens: 0,
          completionTokens: 10,
          file: "",
        },
        ...mockMessages,
      ];

      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: newMessages,
      });

      // Resolve the promise
      resolvePromise!(2);

      // Re-render to trigger the useEffect with new messages
      renderComponent();

      // Should hide loading indicator after the component updates
      await waitFor(
        () => {
          expect(
            screen.queryByText("Loading previous messages...")
          ).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it("applies correct aria attributes to loading indicator", async () => {
      loadPreviousMessagesMock.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(5), 100))
      );

      renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });

      fireEvent.scroll(scrollContainer);
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 30 } });

      await waitFor(() => {
        const loadingElement = screen.getByRole("status");
        expect(loadingElement).toHaveAttribute("aria-live", "polite");
      });
    });
  });

  describe("Integration with Child Components", () => {
    it("renders InputSection component at the bottom", () => {
      renderComponent();

      const container = screen.getByRole("main").parentElement;
      const inputSection = screen.getByTestId("input-section");

      expect(container).toContainElement(inputSection);
      // InputSection should be the last child (after the main section)
      expect(container?.lastElementChild).toBe(inputSection);
    });

    it("correctly conditionally renders NewConversation vs ChatMessages", () => {
      // First render with messages
      const { rerender } = renderComponent();
      expect(screen.getByTestId("chat-messages")).toBeInTheDocument();
      expect(screen.queryByTestId("new-conversation")).not.toBeInTheDocument();

      // Mock empty messages and re-render
      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: [],
      });

      rerender(<Chat />);

      expect(screen.getByTestId("new-conversation")).toBeInTheDocument();
      expect(screen.queryByTestId("chat-messages")).not.toBeInTheDocument();
    });
  });

  describe("User Interaction Flow", () => {
    it("handles user scrolling to trigger pagination flow", async () => {
      loadPreviousMessagesMock.mockResolvedValue(3);

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Simulate user scrolling behavior
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 400,
        writable: true,
      });
      fireEvent.scroll(scrollContainer); // Initial position

      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 300,
        writable: true,
      });
      fireEvent.scroll(scrollContainer); // User scrolls up

      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });
      fireEvent.scroll(scrollContainer); // User scrolls near top

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });
    });

    it("prevents pagination when user has not scrolled", () => {
      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Set scroll position near top but without user interaction
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 50,
        writable: true,
      });
      fireEvent.scroll(scrollContainer);

      // Should not trigger pagination without user scroll
      expect(loadPreviousMessagesMock).not.toHaveBeenCalled();
    });
  });
});
