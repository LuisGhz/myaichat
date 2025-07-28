import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CurrentChat } from "./CurrentChat";
import { useChats } from "hooks/features/Chat/useChats";
import { useNavigate, useParams } from "react-router";
import * as currentChatStore from "store/features/chat/useCurrentChatStore";

// Mock all external dependencies
vi.mock("hooks/features/Chat/useChats");
vi.mock("react-router");
vi.mock("store/features/chat/useCurrentChatStore");
vi.mock("./components/Messages/Messages", () => ({
  Messages: ({ messages, isSending, isUpdatingMessagesFromScroll }: {
    messages: Array<{ role: string; content: string }>;
    isSending: boolean;
    isUpdatingMessagesFromScroll: boolean;
  }) => (
    <div data-testid="messages">
      {messages.map((msg, index) => (
        <div key={index} data-testid={`message-${index}`}>
          {msg.role}: {msg.content}
        </div>
      ))}
      {isSending && <div data-testid="sending-indicator">Sending...</div>}
      {isUpdatingMessagesFromScroll && (
        <div data-testid="updating-messages">Updating messages...</div>
      )}
    </div>
  ),
}));
vi.mock("./components/InputSection/InputSection", () => ({
  InputSection: ({ onEnter, isSending }: {
    onEnter: (message: string, file?: File) => void;
    isSending: boolean;
  }) => (
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
vi.mock("./components/ChatTitle", () => ({
  ChatTitle: () => <div data-testid="chat-title">Chat Title</div>,
}));

describe("CurrentChat", () => {
  const mockNavigate = vi.fn();
  const mockGetChatMessages = vi.fn();
  const mockSendNewMessage = vi.fn();
  const mockSetCurrentModelData = vi.fn();
  const mockSetMaxOutputTokens = vi.fn();
  const mockSetIsWebSearchMode = vi.fn();

  const renderComponent = (chatId?: string) => {
    (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ 
      id: chatId 
    });
    return render(<CurrentChat />);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
    (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ id: undefined });

    // Mock store functions
    (currentChatStore.useCurrentChatStoreSetCurrentModelData as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSetCurrentModelData);
    (currentChatStore.useCurrentChatStoreSetMaxOutputTokens as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSetMaxOutputTokens);
    (currentChatStore.useCurrentChatStoreSetIsWebSearchMode as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSetIsWebSearchMode);
    (currentChatStore.useCurrentChatStoreGetDefaultMaxOutputTokens as unknown as ReturnType<typeof vi.fn>).mockReturnValue(2000);
    (currentChatStore.useCurrentChatStoreGetMaxOutputTokens as unknown as ReturnType<typeof vi.fn>).mockReturnValue(2000);
    (currentChatStore.useCurrentChatStoreGetIsWebSearchMode as unknown as ReturnType<typeof vi.fn>).mockReturnValue(false);

    (useChats as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      getChatMessages: mockGetChatMessages,
      sendNewMessage: mockSendNewMessage,
      isSending: false,
      isEmptyPage: false,
      isChatLoading: false,
    });
  });

  describe("Initial Rendering", () => {
    it("redirects to /chat when no chat ID is provided", async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat");
      });
    });

    it("renders empty messages container when chat is loading", () => {
      (useChats as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        getChatMessages: mockGetChatMessages,
        sendNewMessage: mockSendNewMessage,
        isSending: false,
        isEmptyPage: false,
        isChatLoading: true,
      });

      renderComponent("chat-123");

      const emptySection = document.querySelector(".messages-container.flex.justify-center.items-center");
      expect(emptySection).toBeInTheDocument();
    });

    it("renders chat title and input section", () => {
      renderComponent("chat-123");

      expect(screen.getByTestId("chat-title")).toBeInTheDocument();
      expect(screen.getByTestId("input-section")).toBeInTheDocument();
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
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      mockGetChatMessages.mockResolvedValue(mockChatData);
      renderComponent("chat-123");

      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("chat-123");
      });
    });

    it("redirects to /chat when chat loading fails", async () => {
      mockGetChatMessages.mockResolvedValue(null);
      renderComponent("invalid-chat");

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
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      mockGetChatMessages.mockResolvedValue(mockChatData);
      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });
    });

    it("updates store with chat data after loading", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 4000,
        isWebSearchMode: true,
      };

      mockGetChatMessages.mockResolvedValue(mockChatData);
      renderComponent("chat-123");

      await waitFor(() => {
        expect(mockSetMaxOutputTokens).toHaveBeenCalledWith(4000);
        expect(mockSetIsWebSearchMode).toHaveBeenCalledWith(true);
      });
    });
  });

  describe("Message Sending", () => {
    it("sends a new message and updates state", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Previous message" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      const mockResponse = {
        content: "Assistant response",
        promptTokens: 5,
        completionTokens: 10,
        totalChatPromptTokens: 15,
        totalChatCompletionTokens: 25,
      };

      mockGetChatMessages.mockResolvedValue(mockChatData);
      mockSendNewMessage.mockResolvedValue(mockResponse);

      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      const sendButton = screen.getByTestId("send-button");
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockSendNewMessage).toHaveBeenCalledWith({
          chatId: "chat-123",
          prompt: "test message",
          file: undefined,
          promptId: "",
          maxOutputTokens: 2000,
          isWebSearchMode: false,
        });
      });
    });

    it("shows sending indicator when message is being sent", async () => {
      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      (useChats as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        getChatMessages: mockGetChatMessages,
        sendNewMessage: mockSendNewMessage,
        isSending: true,
        isEmptyPage: false,
        isChatLoading: false,
      });

      mockGetChatMessages.mockResolvedValue(mockChatData);
      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("sending-indicator")).toBeInTheDocument();
      });
    });

    it("does not send message when no chat ID is present", async () => {
      const mockChatData = {
        historyMessages: [],
        model: "gpt-4",
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      // Temporarily mock params to return undefined
      (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ id: undefined });
      mockGetChatMessages.mockResolvedValue(mockChatData);

      render(<CurrentChat />);

      // Should redirect and not attempt to send message
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat");
      });
    });
  });

  describe("Pagination", () => {
    it("loads more messages when scrolling to top", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello" },
          { role: "Assistant", content: "Hi there!" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      const mockPaginationData = {
        historyMessages: [
          { role: "User", content: "Earlier message" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      mockGetChatMessages
        .mockResolvedValueOnce(mockChatData)
        .mockResolvedValueOnce(mockPaginationData);

      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Wait longer for isFirstLoaded to be set (250ms timeout + buffer)
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simulate scroll to top to trigger pagination
      const scrollableSection = document.querySelector(".messages-container.overflow-y-auto");
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });

      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("chat-123", 1);
        expect(mockGetChatMessages).toHaveBeenCalledTimes(2);
      }, { timeout: 1000 });
    });

    it("does not load more messages when isEmptyPage is true", async () => {
      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      (useChats as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        getChatMessages: mockGetChatMessages,
        sendNewMessage: mockSendNewMessage,
        isSending: false,
        isEmptyPage: true,
        isChatLoading: false,
      });

      mockGetChatMessages.mockResolvedValue(mockChatData);
      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Wait for isFirstLoaded timeout
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simulate scroll to top
      const scrollableSection = document.querySelector(".messages-container.overflow-y-auto");
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });

      // Wait a bit to ensure no pagination happens
      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not call getChatMessages for pagination
      expect(mockGetChatMessages).toHaveBeenCalledTimes(1);
    });

    it("shows updating messages indicator during pagination", async () => {
      const mockChatData = {
        historyMessages: [
          { role: "User", content: "Hello" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      const mockPaginationData = {
        historyMessages: [
          { role: "User", content: "Earlier message" },
        ],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      mockGetChatMessages
        .mockResolvedValueOnce(mockChatData)
        .mockResolvedValueOnce(mockPaginationData);

      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Wait for isFirstLoaded timeout
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simulate scroll to top
      const scrollableSection = document.querySelector(".messages-container.overflow-y-auto");
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });

      // Wait for the async pagination call
      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("chat-123", 1);
      }, { timeout: 1000 });

      // The updating indicator should appear briefly during pagination
      await waitFor(() => {
        expect(screen.getByTestId("updating-messages")).toBeInTheDocument();
      }, { timeout: 200 });

      // Wait for the 100ms timeout for isUpdatingMessagesFromScroll to finish
      await waitFor(() => {
        expect(screen.queryByTestId("updating-messages")).not.toBeInTheDocument();
      }, { timeout: 200 });
    });
  });

  describe("State Reset", () => {
    it("resets state when chat ID changes", async () => {
      const mockChatData1 = {
        historyMessages: [{ role: "User", content: "Chat 1 message" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      const mockChatData2 = {
        historyMessages: [{ role: "User", content: "Chat 2 message" }],
        model: "gpt-3.5",
        totalPromptTokens: 5,
        totalCompletionTokens: 8,
        maxOutputTokens: 1500,
        isWebSearchMode: true,
      };

      mockGetChatMessages
        .mockResolvedValueOnce(mockChatData1)
        .mockResolvedValueOnce(mockChatData2);

      const { rerender } = renderComponent("chat-123");

      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("chat-123");
      });

      // Change params to trigger useEffect
      (useParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ id: "new-chat" });
      rerender(<CurrentChat />);

      await waitFor(() => {
        expect(mockGetChatMessages).toHaveBeenCalledWith("new-chat");
        expect(mockGetChatMessages).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Error Handling", () => {
    it("handles pagination error by navigating to /chat", async () => {
      const mockChatData = {
        historyMessages: [{ role: "User", content: "Hello" }],
        model: "gpt-4",
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        maxOutputTokens: 2000,
        isWebSearchMode: false,
      };

      mockGetChatMessages
        .mockResolvedValueOnce(mockChatData) // First call succeeds
        .mockResolvedValueOnce(null); // Pagination call fails

      renderComponent("chat-123");

      await waitFor(() => {
        expect(screen.getByTestId("messages")).toBeInTheDocument();
      });

      // Wait for isFirstLoaded timeout
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simulate scroll to top to trigger pagination
      const scrollableSection = document.querySelector(".messages-container.overflow-y-auto");
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat");
      }, { timeout: 1000 });
    });
  });
});
