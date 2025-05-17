/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CurrentChat } from "./CurrentChat";
import { AppContext, AppContextProps } from "context/AppContext";
import * as useChats from "hooks/useChats";

// Mock child components
vi.mock("./Messages/Messages", () => ({
  Messages: vi.fn(({ messages }) => (
    <div data-testid="messages-component">Messages: {messages.length}</div>
  )),
}));
vi.mock("./InputSection/InputSection", () => ({
  InputSection: vi.fn(({ onEnter, isSending }) => (
    <div data-testid="input-section-component">
      <button
        data-testid="send-button"
        onClick={() => onEnter("test message", undefined)}
      >
        Send
      </button>
      <span>InputSending: {String(isSending)}</span>
    </div>
  )),
}));
vi.mock("./NewConversation", () => ({
  NewConversation: vi.fn(({ setModel, setPromptId, setIsWelcomeLoaded }) => (
    <div data-testid="new-conversation-component">
      NewConversation
      <button onClick={() => setModel("test-model")}>SetModel</button>
      <button onClick={() => setPromptId("test-prompt")}>SetPrompt</button>
      <button onClick={() => setIsWelcomeLoaded(true)}>SetWelcomeLoaded</button>
    </div>
  )),
}));
vi.mock("./CurrentModelSummary", () => ({
  CurrentModelSummary: vi.fn(() => (
    <div data-testid="current-model-summary-component">CurrentModelSummary</div>
  )),
}));
vi.mock("./ChatsLoading", () => ({
  ChatsLoading: vi.fn(() => (
    <div data-testid="chats-loading-component">ChatsLoading</div>
  )),
}));

// Mock hooks
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useParams: () => mockUseParams(),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("hooks/useChats");

describe.todo("CurrentChat", () => {
  const mockGetChatMessages = vi.fn();
  const mockSendNewMessage = vi.fn();
  const mockSetIsEmptyPage = vi.fn();
  const mockGetAllChatsForList = vi.fn();
  const appContextValue: AppContextProps = {
    getAllChatsForList: mockGetAllChatsForList,
    chats: [],
    deleteChatById: vi.fn(),
    isMenuOpen: false,
    setIsMenuOpen: vi.fn(),
  };

  const renderWithContext = (ui: React.ReactElement) => {
    return render(
      <AppContext.Provider value={appContextValue}>{ui}</AppContext.Provider>
    );
  };

  const mockingUseChats = (props: any = {}) => {
    // Reset useChats mock to default for each test
    const def = {
      deleteChat: vi.fn(),
      getAllChats: vi.fn(),
      getChatMessages: mockGetChatMessages,
      isChatLoading: true,
      isEmptyPage: false,
      isSending: false,
      sendNewMessage: mockSendNewMessage,
      setIsEmptyPage: mockSetIsEmptyPage,
    };
    // Re-apply the mock implementation with the reset default
    vi.mocked(useChats.useChats).mockReturnValue({ ...def, ...props });
  };
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockingUseChats();
    mockUseParams.mockReturnValue({}); // Default to no params
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders NewConversation when no chat ID, not loading, and messages are empty", () => {
    mockUseParams.mockReturnValue({});
    mockingUseChats({ isChatLoading: false });

    renderWithContext(<CurrentChat />);

    expect(
      screen.getByTestId("new-conversation-component")
    ).toBeInTheDocument();
    expect(screen.getByTestId("input-section-component")).toBeInTheDocument();
    expect(
      screen.queryByTestId("chats-loading-component")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("messages-component")).not.toBeInTheDocument();
  });

  it("renders empty grow div when chat ID exists, messages are empty, not loading, and not welcome screen", async () => {
    mockUseParams.mockReturnValue({ id: "chat123" });
    mockingUseChats({ isChatLoading: false });
    mockGetChatMessages.mockResolvedValue({
      historyMessages: [],
      model: "test-model",
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
    });

    const { container } = renderWithContext(<CurrentChat />);

    await act(async () => {
      vi.advanceTimersByTime(300); // For handleFirstPageLoad's setTimeout
    });

    expect(
      screen.queryByTestId("new-conversation-component")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("chats-loading-component")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("messages-component")).not.toBeInTheDocument();
    expect(screen.getByTestId("input-section-component")).toBeInTheDocument();

    const mainContainer = container.firstChild as HTMLElement;
    const growDiv = Array.from(mainContainer.childNodes).find((node) =>
      (node as HTMLElement).classList?.contains("grow")
    );
    expect(growDiv).toBeInTheDocument();
  });

  it("renders ChatsLoading when chat ID exists, isChatLoading is true, page is 0, and messages are empty", async () => {
    mockUseParams.mockReturnValue({ id: "chat123" });
    mockingUseChats({ isChatLoading: true });
    mockGetChatMessages.mockReturnValue(new Promise(() => {})); // Keep it pending

    renderWithContext(<CurrentChat />);

    expect(screen.getByTestId("chats-loading-component")).toBeInTheDocument();
    expect(screen.getByTestId("input-section-component")).toBeInTheDocument();
  });

  it("renders Messages when messages exist", async () => {
    mockUseParams.mockReturnValue({ id: "chat123" });
    const initialMessages = [{ role: "User" as const, content: "Hello" }];
    mockGetChatMessages.mockResolvedValue({
      historyMessages: initialMessages,
      model: "test-model",
      totalPromptTokens: 10,
      totalCompletionTokens: 20,
    });
    mockingUseChats({ isChatLoading: false });

    renderWithContext(<CurrentChat />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId("messages-component")).toBeInTheDocument();
    expect(screen.getByText("Messages: 1")).toBeInTheDocument();
  });

  it("renders CurrentModelSummary when currentModel exists and messages.length > 1", async () => {
    mockUseParams.mockReturnValue({ id: "chat123" });
    const initialMessages = [
      { role: "User" as const, content: "Hello" },
      { role: "Assistant" as const, content: "Hi" },
    ];
    mockGetChatMessages.mockResolvedValue({
      historyMessages: initialMessages,
      model: "test-model-active",
      totalPromptTokens: 10,
      totalCompletionTokens: 20,
    });
    mockingUseChats({ isChatLoading: false });

    renderWithContext(<CurrentChat />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(
      screen.getByTestId("current-model-summary-component")
    ).toBeInTheDocument();
  });

  it("calls onEnter, updates messages, calls sendNewMessage for a new chat, and handles navigation", async () => {
    mockUseParams.mockReturnValue({}); // New chat
    mockingUseChats({ isChatLoading: false });
    const sendMessageResponse = {
      content: "Assistant response",
      chatId: "newChat456",
      promptTokens: 5,
      completionTokens: 15,
      totalChatPromptTokens: 5,
      totalChatCompletionTokens: 15,
    };
    mockSendNewMessage.mockResolvedValue(sendMessageResponse);

    const { rerender } = renderWithContext(<CurrentChat />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("send-button"));
    });

    await waitFor(() => {
      expect(screen.getByTestId("messages-component")).toBeInTheDocument();
      expect(screen.getByText("Messages: 2")).toBeInTheDocument(); // User + Assistant
    });

    expect(mockSendNewMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        chatId: undefined,
        prompt: "test message",
        model: "gemini-2.0-flash", // Default initial model
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/chat/newChat456", {
      replace: true,
    });
    expect(mockGetAllChatsForList).toHaveBeenCalledTimes(1);

    // Simulate navigation causing params.id to update and component to re-evaluate useEffects
    mockUseParams.mockReturnValue({ id: sendMessageResponse.chatId });
    act(() => {
      rerender(
        <AppContext.Provider value={appContextValue}>
          <CurrentChat />
        </AppContext.Provider>
      );
    });

    // Messages should persist because isSendingFirstMessage.current was true
    expect(screen.getByText("Messages: 2")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(250); // For sendMessage's setTimeout to set isSendingFirstMessage.current = false
    });
  });

  it("calls onEnter for an existing chat", async () => {
    const chatId = "existingChat789";
    mockUseParams.mockReturnValue({ id: chatId });
    const initialMessages = [
      { role: "User" as const, content: "Previous message" },
    ];
    mockGetChatMessages.mockResolvedValue({
      historyMessages: initialMessages,
      model: "gpt-4",
      totalPromptTokens: 10,
      totalCompletionTokens: 20,
    });
    mockingUseChats({ isChatLoading: false });
    const sendMessageResponse = {
      content: "Assistant response to existing",
      promptTokens: 7,
      completionTokens: 17,
      totalChatPromptTokens: 17,
      totalChatCompletionTokens: 37,
    };
    mockSendNewMessage.mockResolvedValue(sendMessageResponse);

    renderWithContext(<CurrentChat />);
    await act(async () => {
      vi.advanceTimersByTime(300);
    }); // Initial load

    expect(screen.getByText("Messages: 1")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("send-button"));
    });

    await waitFor(() => {
      expect(screen.getByText("Messages: 3")).toBeInTheDocument(); // Prev + User + Assistant
    });
    expect(mockSendNewMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        chatId: chatId,
        model: undefined, // Model not sent for existing chat
      })
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // isFirstLoaded is not updating. Pending research.
  it.todo("increments page on scroll to top", async () => {
    mockUseParams.mockReturnValue({ id: "chat123" });
    mockGetChatMessages
      .mockResolvedValueOnce({
        historyMessages: [
          { role: "User", content: "Msg1 Page0" },
          { role: "User", content: "Msg1 Page0".repeat(100) },
          { role: "User", content: "Msg1 Page0".repeat(100) },
        ],
        model: "test-model",
      })
      .mockResolvedValueOnce({
        historyMessages: [{ role: "User", content: "Msg1 Page1" }],
        model: "test-model",
      });
    mockingUseChats({ isChatLoading: false, isEmptyPage: false });

    const { container } = renderWithContext(<CurrentChat />);

    expect(mockGetChatMessages).toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    }); // isFirstLoaded = true
    expect(screen.getByText("Messages: 3")).toBeInTheDocument();
    const scrollableSection = container.querySelector(
      ".overflow-y-auto.hide-scrollbar"
    );
    expect(scrollableSection).toBeInTheDocument();

    await act(async () => {
      fireEvent.scroll(scrollableSection!, { target: { scrollTop: 0 } });
    });
    await act(async () => {
      vi.advanceTimersByTime(100);
    }); // setIsUpdatingMessagesFromScroll timeout
    screen.debug();
    
    expect(mockGetChatMessages).toHaveBeenCalledTimes(2);
    expect(mockGetChatMessages).toHaveBeenNthCalledWith(2, "chat123", 1);
    await waitFor(() => {
    expect(screen.getByText("Messages: 4")).toBeInTheDocument(); // Page1 msg + Page0 msg
    });
  });

  it.todo(
    "navigates away if getChatMessages returns null on initial load",
    async () => {
      mockUseParams.mockReturnValue({ id: "chat123" });
      mockGetChatMessages.mockResolvedValue(null);
      mockingUseChats({ isChatLoading: false });

      renderWithContext(<CurrentChat />);

      await act(async () => {
        await Promise.resolve();
      }); // Allow promises to settle

      expect(mockNavigate).toHaveBeenCalledWith("/chat");
    }
  );
});
