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

// Mock store before imports to avoid hoisting issues
const useChatStoreMock = vi.fn(() => ({
  isStreaming: false,
}));

vi.mock("../hooks/useChatParams");
vi.mock("../hooks/useChat");
vi.mock("react-router", () => ({
  useLocation: vi.fn(),
}));
vi.mock("store/app/ChatStore", () => ({
  useChatStore: () => useChatStoreMock(),
}));

import { useChatParams } from "../hooks/useChatParams";
import { useChat } from "../hooks/useChat";
import { useLocation } from "react-router";

const mockUseChatParams = vi.mocked(useChatParams);
const mockUseChat = vi.mocked(useChat);
const mockUseLocation = vi.mocked(useLocation);
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
    mockUseLocation.mockReturnValue({
      state: null,
      pathname: "/",
      search: "",
      hash: "",
      key: "",
    });

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
    it("triggers pagination when scrolling near the top after first page loads", async () => {
      loadPreviousMessagesMock.mockResolvedValue(5); // Mock returning 5 new messages

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for the first page to be marked as loaded (1000ms timeout in component)
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Mock scrollTop to be near the top (within tolerance of 20px)
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15, // Within 20px tolerance
        writable: true,
      });

      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });

      await waitFor(
        () => {
          expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
        },
        { timeout: 500 }
      );
    });

    it("does not trigger pagination before first page is loaded", () => {
      loadPreviousMessagesMock.mockResolvedValue(5);

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Try to trigger pagination immediately (before 1000ms timeout)
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer);

      // Should not trigger pagination yet
      expect(loadPreviousMessagesMock).not.toHaveBeenCalled();
    });

    it("does not trigger pagination when empty page is reached", async () => {
      loadPreviousMessagesMock.mockResolvedValueOnce(-1); // First call returns empty page

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Trigger pagination once
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });

      // Try to trigger pagination again after empty page
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 10,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 10 } });

      // Should not call loadPreviousMessages again since empty page was reached
      expect(loadPreviousMessagesMock).toHaveBeenCalledTimes(1);
    });

    it("does not trigger pagination when isStreaming is true", async () => {
      useChatStoreMock.mockReturnValue({ isStreaming: true });
      loadPreviousMessagesMock.mockResolvedValue(5);
      renderComponent();
      const scrollContainer = screen.getByRole("main");
      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));
      // Try to trigger pagination
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });
      // Should not trigger pagination when isStreaming is true
      await waitFor(() => {
        expect(loadPreviousMessagesMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("Pagination Logic", () => {
    it("increments page number correctly on subsequent pagination", async () => {
      loadPreviousMessagesMock.mockResolvedValue(3);

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Trigger first pagination
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });

      // Trigger second pagination
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 10,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 10 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 2);
      });
    });

    it("handles empty page response correctly and stops pagination", async () => {
      loadPreviousMessagesMock.mockResolvedValue(-1); // Empty page

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Trigger pagination
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
      });

      // Try to trigger pagination again after empty page
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 5,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 5 } });

      // Should not trigger another pagination call
      expect(loadPreviousMessagesMock).toHaveBeenCalledTimes(1);
    });

    it("logs new messages count on successful pagination", async () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      loadPreviousMessagesMock.mockResolvedValue(3);

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Trigger pagination
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("New messages loaded:", 3);
      });

      consoleSpy.mockRestore();
    });

    it("calls loadPreviousMessages with undefined ID when no chat ID is present", async () => {
      mockUseChatParams.mockReturnValue({ id: undefined });

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page load timeout
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Try to trigger pagination - will still call with undefined due to non-null assertion
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 15,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 15 } });

      await waitFor(() => {
        expect(loadPreviousMessagesMock).toHaveBeenCalledWith(undefined, 1);
      });
    });
  });

  describe("Auto-scroll Behavior", () => {
    it("scrolls to bottom after initial load delay", async () => {
      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Mock scrollHeight to simulate content
      Object.defineProperty(scrollContainer, "scrollHeight", {
        value: 1000,
        writable: false,
        configurable: true,
      });

      // Wait for the initial scroll timeout (200ms) and verify scroll happened
      await new Promise((resolve) => setTimeout(resolve, 250));

      // The component should have set scrollTop to scrollHeight
      expect(scrollContainer.scrollTop).toBe(1000);
    });

    it("scrolls to bottom when assistant message finishes after user message", async () => {
      // Start with just a user message
      const userMessage: ChatMessage = {
        role: "User",
        content: "Hello",
        promptTokens: 5,
        completionTokens: 0,
        file: "",
      };

      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: [userMessage],
      });

      const { rerender } = renderComponent();

      const scrollContainer = screen.getByRole("main");
      Object.defineProperty(scrollContainer, "scrollHeight", {
        value: 1000,
        writable: true,
        configurable: true,
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: "Assistant",
        content: "Hi there!",
        promptTokens: 0,
        completionTokens: 10,
        file: "",
      };

      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: [userMessage, assistantMessage],
      });

      rerender(<Chat />);

      // Wait for the scroll timeout (250ms) after assistant message
      await waitFor(
        () => {
          expect(scrollContainer.scrollTop).toBe(1000);
        },
        { timeout: 350 }
      );
    });

    it("does not trigger user-assistant sequence auto-scroll when assistant message comes without user message first", async () => {
      // Start with an assistant message directly (no user message first)
      const assistantMessage: ChatMessage = {
        role: "Assistant",
        content: "Hello!",
        promptTokens: 0,
        completionTokens: 10,
        file: "",
      };

      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages: [assistantMessage],
      });

      const { rerender } = renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for initial auto-scroll to complete
      await new Promise((resolve) => setTimeout(resolve, 250));

      // Reset scrollTop after initial auto-scroll
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 100,
        writable: true,
        configurable: true,
      });

      // Add another assistant message without a user message
      const messages = [
        assistantMessage,
        {
          role: "Assistant" as const,
          content: "Another message!",
          promptTokens: 0,
          completionTokens: 10,
          file: "",
        },
      ];

      mockUseChat.mockReturnValue({
        ...defaultChatHookReturn,
        messages,
      });

      rerender(<Chat />);

      // Wait beyond the user-assistant sequence timeout to confirm no additional auto-scroll
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Should not have changed from our test value since no user->assistant sequence
      expect(scrollContainer.scrollTop).toBe(100);
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

      // Should have been called for each ID change (without page param in getChatMessages)
      expect(getChatMessagesMock).toHaveBeenCalledWith("chat-123"); // initial
      expect(getChatMessagesMock).toHaveBeenCalledWith("chat-456"); // first change
      expect(getChatMessagesMock).toHaveBeenCalledWith("chat-789"); // second change
    });

    it("handles scroll events with tolerance correctly", async () => {
      // Clear any previous calls
      loadPreviousMessagesMock.mockClear();
      loadPreviousMessagesMock.mockResolvedValue(3);

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Test just under the tolerance boundary (19px < 20px) - should trigger
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 19,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 19 } });

      // Should trigger pagination when scrollTop < tolerance (19 < 20)
      await waitFor(
        () => {
          expect(loadPreviousMessagesMock).toHaveBeenCalledWith("chat-123", 1);
        },
        { timeout: 500 }
      );
    });

    it("does not trigger pagination when scroll is above tolerance", async () => {
      loadPreviousMessagesMock.mockResolvedValue(3);

      renderComponent();

      const scrollContainer = screen.getByRole("main");

      // Wait for first page to load
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Test above the tolerance (21px > 20px tolerance)
      Object.defineProperty(scrollContainer, "scrollTop", {
        value: 21,
        writable: true,
      });
      fireEvent.scroll(scrollContainer, { target: { scrollTop: 21 } });

      // Wait a bit to ensure no pagination is triggered
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not trigger pagination above tolerance
      expect(loadPreviousMessagesMock).not.toHaveBeenCalled();
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

  describe("Chat ID Effects", () => {
    it("resets chat data when no ID is provided", () => {
      mockUseChatParams.mockReturnValue({ id: undefined });

      renderComponent();

      expect(resetChatDataMock).toHaveBeenCalled();
      expect(getChatMessagesMock).not.toHaveBeenCalled();
    });

    it("calls getChatMessages when ID is provided", () => {
      mockUseChatParams.mockReturnValue({ id: "chat-123" });

      renderComponent();

      expect(getChatMessagesMock).toHaveBeenCalledWith("chat-123");
      expect(resetChatDataMock).not.toHaveBeenCalled();
    });

    it("does not call getChatMessages when fromStream is true", () => {
      mockUseLocation.mockReturnValue({
        state: { fromStream: true },
        pathname: "/",
        search: "",
        hash: "",
        key: "",
      });
      mockUseChatParams.mockReturnValue({ id: "chat-123" });

      renderComponent();

      expect(getChatMessagesMock).not.toHaveBeenCalled();
      expect(resetChatDataMock).not.toHaveBeenCalled();
    });
  });

  describe("Component Structure and Accessibility", () => {
    it("has proper accessibility attributes", () => {
      renderComponent();

      const mainSection = screen.getByRole("main");
      expect(mainSection).toHaveAttribute("aria-label", "Chat conversation");
    });

    it("applies correct CSS classes for responsive design", () => {
      renderComponent();

      const mainSection = screen.getByRole("main");
      expect(mainSection).toHaveClass(
        "grow",
        "overflow-auto",
        "pb-10",
        "scroll-hidden",
        "mx-auto",
        "w-full",
        "md:w-11/12",
        "xl:10/12",
        "max-w-4xl",
        "scroll-smooth"
      );
    });
  });
});
