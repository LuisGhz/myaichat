/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CurrentChat } from "./CurrentChat";
import { useChats } from "hooks/useChats";
import { useNavigate, useParams } from "react-router";
import { useAppAddChatStore } from "store/useAppStore";

// Mock all external dependencies
vi.mock("hooks/useChats");
vi.mock("react-router");
vi.mock("store/useAppStore");
vi.mock("./components/Messages/Messages", () => ({
  Messages: ({ messages, isSending }: any) => (
    <div data-testid="messages">
      {messages.map((msg: any, index: number) => (
        <div key={index} data-testid={`message-${index}`}>
          {msg.role}: {msg.content}
        </div>
      ))}
      {isSending && <div data-testid="sending-indicator">Sending...</div>}
    </div>
  ),
}));
vi.mock("./components/InputSection/InputSection", () => ({
  InputSection: ({ onEnter, isSending }: any) => (
    <div data-testid="input-section">
      <button
        onClick={() => onEnter("test message", undefined)}
        disabled={isSending}
        data-testid="send-button"
      >
        Send
      </button>
    </div>
  ),
}));
vi.mock("./components/NewConversation", () => ({
  NewConversation: ({ model, setIsWelcomeLoaded }: any) => (
    <div data-testid="new-conversation">
      <span>Model: {model}</span>
      <button
        onClick={() => setIsWelcomeLoaded(true)}
        data-testid="welcome-button"
      >
        Start
      </button>
    </div>
  ),
}));
vi.mock("./components/CurrentModelSummary", () => ({
  CurrentModelSummary: ({
    currentModel,
    totalPromptTokens,
    totalCompletionTokens,
  }: any) => (
    <div data-testid="model-summary">
      Model: {currentModel}, Prompt: {totalPromptTokens}, Completion:{" "}
      {totalCompletionTokens}
    </div>
  ),
}));
vi.mock("./components/ChatsLoading", () => ({
  ChatsLoading: () => <div data-testid="chats-loading">Loading...</div>,
}));

describe("CurrentChat", () => {
  const mockNavigate = vi.fn();
  const mockAddChat = vi.fn();
  const mockGetChatMessages = vi.fn();
  const mockSendNewMessage = vi.fn();
  const mockSetIsEmptyPage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAppAddChatStore as any).mockReturnValue(mockAddChat);
    (useParams as any).mockReturnValue({ id: undefined });

    (useChats as any).mockReturnValue({
      getChatMessages: mockGetChatMessages,
      sendNewMessage: mockSendNewMessage,
      isSending: false,
      isEmptyPage: false,
      setIsEmptyPage: mockSetIsEmptyPage,
      isChatLoading: false,
    });
  });

  describe("Initial Rendering", () => {
    it("renders new conversation when no chat ID and no messages", () => {
      render(<CurrentChat />);

      expect(screen.getByTestId("new-conversation")).toBeInTheDocument();
      expect(screen.getByText("Model: gemini-2.0-flash")).toBeInTheDocument();
      expect(screen.getByTestId("input-section")).toBeInTheDocument();
    });

    it("renders empty state when welcome is not loaded", () => {
      render(<CurrentChat />);

      const emptyDiv = document.querySelector(".grow:empty");
      expect(emptyDiv).toBeInTheDocument();
    });

    it("renders loading state when chat is loading", () => {
      (useChats as any).mockReturnValue({
        getChatMessages: mockGetChatMessages,
        sendNewMessage: mockSendNewMessage,
        isSending: false,
        isEmptyPage: false,
        setIsEmptyPage: mockSetIsEmptyPage,
        isChatLoading: true,
      });

      render(<CurrentChat />);

      expect(screen.getByTestId("chats-loading")).toBeInTheDocument();
    });
  });

  describe("Chat Loading", () => {
    it("loads chat messages when chat ID is present", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello" },
          { role: "Assistant", content: "Hi there!" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("chat-123");
      });
    });

    it("navigates to /chat when chat loading fails", async () => {
      (useParams as any).mockReturnValue({ id: "invalid-chat" });
      mockGetChatMessages.mockResolvedValue(null);

      render(<CurrentChat />);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat");
      });
    });

    it("renders messages when they exist", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello" },
          { role: "Assistant", content: "Hi there!" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });
    });
  });

  describe("Message Sending", () => {
    it("sends a new message and updates state", async () => {
      const mockResponse = {
        content: "Assistant response",
        promptTokens: 5,
        completionTokens: 10,
        totalChatPromptTokens: 15,
        totalChatCompletionTokens: 25,
      };

      mockSendNewMessage.mockResolvedValue(mockResponse);

      render(<CurrentChat />);

      const sendButton = screen.getByTestId("send-button");
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockSendNewMessage).toHaveBeenCalledWith({
          chatId: undefined,
          prompt: "test message",
          image: undefined,
          promptId: "",
          model: "gemini-2.0-flash",
        });
      });
    });

    it("creates new chat and navigates when sending first message", async () => {
      const mockResponse = {
        content: "Assistant response",
        promptTokens: 5,
        completionTokens: 10,
        totalChatPromptTokens: 15,
        totalChatCompletionTokens: 25,
        chatId: "new-chat-123",
        chatTitle: "New Chat",
      };

      mockSendNewMessage.mockResolvedValue(mockResponse);

      render(<CurrentChat />);

      const sendButton = screen.getByTestId("send-button");
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat/new-chat-123", {
          replace: true,
        });
        expect(mockAddChat).toHaveBeenCalledWith({
          id: "new-chat-123",
          title: "New Chat",
        });
      });
    });

    it("shows sending indicator when message is being sent", () => {
      (useChats as any).mockReturnValue({
        getChatMessages: mockGetChatMessages,
        sendNewMessage: mockSendNewMessage,
        isSending: true,
        isEmptyPage: false,
        setIsEmptyPage: mockSetIsEmptyPage,
        isChatLoading: false,
      });

      // Set up initial messages to render Messages component
      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      waitFor(() => {
        expect(screen.getByTestId("sending-indicator")).toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    // TODO: Pending to research about settimeout and its issues with faketimers (tests keep loading until timed out)
    it.todo("loads more messages when scrolling to top", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello".repeat(100) },
          { role: "User", content: "Hello".repeat(100) },
          { role: "User", content: "Hello".repeat(100) },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Simulate scroll to top
      const scrollableSection = document.querySelector(
        ".overflow-y-auto.hide-scrollbar"
      );
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });
      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("chat-123", 1);
        expect(mockGetChatMessages).toHaveBeenCalledTimes(2);
      });
    });

    it("does not load more messages when isEmptyPage is true", async () => {
      (useChats as any).mockReturnValue({
        getChatMessages: mockGetChatMessages,
        sendNewMessage: mockSendNewMessage,
        isSending: false,
        isEmptyPage: true,
        setIsEmptyPage: mockSetIsEmptyPage,
        isChatLoading: false,
      });

      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Simulate scroll to top
      const scrollableSection = document.querySelector(".overflow-y-auto");
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });

      // Should not call getChatMessages for pagination
      expect(mockGetChatMessages).toHaveBeenCalledTimes(1);
    });
  });

  describe("Model Summary", () => {
    it("renders model summary when currentModel exists and multiple messages", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello" },
          { role: "Assistant", content: "Hi there!" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      await waitFor(() => {
        expect(screen.getByTestId("model-summary")).toBeInTheDocument();
        expect(
          screen.getByText("Model: gpt-4, Prompt: 10, Completion: 15")
        ).toBeInTheDocument();
      });
    });

    it("does not render model summary with only one message", async () => {
      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      await waitFor(() => {
        expect(screen.queryByTestId("model-summary")).not.toBeInTheDocument();
      });
    });
  });

  describe("State Reset", () => {
    it("resets state when chat ID changes", async () => {
      const { rerender } = render(<CurrentChat />);

      // Change params to trigger useEffect
      (useParams as any).mockReturnValue({ id: "new-chat" });
      mockGetChatMessages.mockResolvedValue({
        historyMessages: [],
        model: "gpt-3.5",
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
      });

      rerender(<CurrentChat />);

      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("new-chat");
      });
    });
  });

  describe("Error Handling", () => {
    it.todo("handles pagination error by navigating to /chat", async () => {
      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
      };

      (useParams as any).mockReturnValue({ id: "chat-123" });
      mockGetChatMessages
        .mockResolvedValueOnce(mockChatData) // First call succeeds
        .mockResolvedValueOnce(null); // Pagination call fails

      render(<CurrentChat />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Simulate scroll to top to trigger pagination
      const scrollableSection = document.querySelector(".overflow-y-auto");
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat");
      });
    });
  });
});
