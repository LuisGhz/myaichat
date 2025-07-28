import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewChatPage } from "./NewChatPage";

// Mock dependencies
const mockNavigate = vi.fn();
const mockAddChat = vi.fn();
const mockResetChatData = vi.fn();
const mockSendNewMessage = vi.fn();
const mockGetMaxOutputTokens = vi.fn();
const mockGetIsWebSearchMode = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("store/useAppStore", () => ({
  useAppAddChatStore: () => mockAddChat,
}));

vi.mock("store/features/chat/useCurrentChatStore", () => ({
  useCurrentChatStoreGetMaxOutputTokens: () => mockGetMaxOutputTokens(),
  useCurrentChatStoreGetIsWebSearchMode: () => mockGetIsWebSearchMode(),
  useCurrentChatStoreResetData: () => mockResetChatData,
}));

vi.mock("hooks/features/Chat/useChats", () => ({
  useChats: () => ({
    sendNewMessage: mockSendNewMessage,
    isSending: false,
  }),
}));

// Mock child components
vi.mock("./components/InputSection/InputSection", () => ({
  InputSection: ({ onEnter, isSending }: { onEnter: (message: string, file?: File) => void; isSending: boolean }) => (
    <div data-testid="input-section">
      <button
        onClick={() => onEnter("test message")}
        disabled={isSending}
        aria-label="Send message"
      >
        Send Message
      </button>
    </div>
  ),
}));

vi.mock("./components/NewConversation", () => ({
  NewConversation: ({ 
    model, 
    setModel, 
    promptId, 
    setPromptId 
  }: { 
    model: string; 
    setModel: (model: string) => void; 
    promptId: string; 
    setPromptId: (id: string) => void; 
  }) => (
    <div data-testid="new-conversation">
      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        aria-label="Select model"
      >
        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
        <option value="gpt-4o">GPT-4o</option>
      </select>
      <select
        value={promptId}
        onChange={(e) => setPromptId(e.target.value)}
        aria-label="Select prompt"
      >
        <option value="">No prompt</option>
        <option value="prompt1">Prompt 1</option>
      </select>
    </div>
  ),
}));

vi.mock("antd", () => ({
  Spin: ({ size }: { size: string }) => (
    <div data-testid="loading-spinner" aria-label={`Loading spinner ${size}`}>
      Loading...
    </div>
  ),
}));

describe("NewChatPage", () => {
  const renderComponent = () => {
    return render(<NewChatPage />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMaxOutputTokens.mockReturnValue(1000);
    mockGetIsWebSearchMode.mockReturnValue(false);
    
    // Return a promise that resolves after a short delay to simulate async behavior
    mockSendNewMessage.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          chatId: "chat-123",
          chatTitle: "New Chat",
        }), 100)
      )
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render the main layout with proper structure", () => {
      renderComponent();

      expect(screen.getByTestId("new-conversation")).toBeInTheDocument();
      expect(screen.getByTestId("input-section")).toBeInTheDocument();
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    it("should have proper accessibility structure with semantic elements", () => {
      renderComponent();

      const sections = screen.getAllByRole("generic");
      expect(sections.length).toBeGreaterThan(0);
    });

    it("should render NewConversation component with default model", () => {
      renderComponent();

      const modelSelect = screen.getByLabelText("Select model");
      expect(modelSelect).toHaveValue("gemini-2.0-flash");
    });

    it("should render InputSection component", () => {
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeInTheDocument();
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe("State Management", () => {
    it("should initialize with correct default state", () => {
      renderComponent();

      const modelSelect = screen.getByLabelText("Select model");
      const promptSelect = screen.getByLabelText("Select prompt");

      expect(modelSelect).toHaveValue("gemini-2.0-flash");
      expect(promptSelect).toHaveValue("");
    });

    it("should reset chat data on component mount", () => {
      renderComponent();

      expect(mockResetChatData).toHaveBeenCalledWith("gemini-2.0-flash");
    });

    it("should allow model selection changes", async () => {
      const user = userEvent.setup();
      renderComponent();

      const modelSelect = screen.getByLabelText("Select model");
      await user.selectOptions(modelSelect, "gpt-4o");

      expect(modelSelect).toHaveValue("gpt-4o");
    });

    it("should allow prompt selection changes", async () => {
      const user = userEvent.setup();
      renderComponent();

      const promptSelect = screen.getByLabelText("Select prompt");
      await user.selectOptions(promptSelect, "prompt1");

      expect(promptSelect).toHaveValue("prompt1");
    });
  });

  describe("Loading States", () => {
    it("should show loading spinner when isLoading is true", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      
      // Click the button to trigger loading
      await user.click(sendButton);

      // Wait for the loading spinner to appear
      await waitFor(() => {
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      });
    });

    it("should hide NewConversation component when loading", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      
      // Click the button to trigger loading
      await user.click(sendButton);

      // Wait for loading state to be active
      await waitFor(() => {
        expect(screen.queryByTestId("new-conversation")).not.toBeInTheDocument();
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      });
    });

    it("should show large loading spinner with proper accessibility", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      
      // Click the button to trigger loading
      await user.click(sendButton);

      // Wait for the loading spinner to appear
      await waitFor(() => {
        const spinner = screen.getByTestId("loading-spinner");
        expect(spinner).toHaveAttribute("aria-label", "Loading spinner large");
      });
    });
  });

  describe("Message Sending Flow", () => {
    it("should send message with correct parameters", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      expect(mockSendNewMessage).toHaveBeenCalledWith({
        chatId: undefined,
        prompt: "test message",
        file: undefined,
        promptId: "",
        maxOutputTokens: 1000,
        isWebSearchMode: false,
        model: "gemini-2.0-flash",
      });
    });

    it("should navigate to chat page after successful message send", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/chat/chat-123", { replace: true });
      });
    });

    it("should add chat to store after successful message send", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      await waitFor(() => {
        expect(mockAddChat).toHaveBeenCalledWith({
          id: "chat-123",
          title: "New Chat",
          fav: false,
        });
      });
    });

    it("should send message with selected model and prompt", async () => {
      const user = userEvent.setup();
      renderComponent();

      // Change model and prompt
      const modelSelect = screen.getByLabelText("Select model");
      const promptSelect = screen.getByLabelText("Select prompt");
      
      await user.selectOptions(modelSelect, "gpt-4o");
      await user.selectOptions(promptSelect, "prompt1");

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      expect(mockSendNewMessage).toHaveBeenCalledWith({
        chatId: undefined,
        prompt: "test message",
        file: undefined,
        promptId: "prompt1",
        maxOutputTokens: 1000,
        isWebSearchMode: false,
        model: "gpt-4o",
      });
    });

    it("should handle message sending with web search mode enabled", async () => {
      mockGetIsWebSearchMode.mockReturnValue(true);
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      expect(mockSendNewMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          isWebSearchMode: true,
        })
      );
    });

    it("should handle message sending with custom max output tokens", async () => {
      mockGetMaxOutputTokens.mockReturnValue(2000);
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      expect(mockSendNewMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          maxOutputTokens: 2000,
        })
      );
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      // Reset all mocks specifically for error handling tests
      vi.clearAllMocks();
      mockGetMaxOutputTokens.mockReturnValue(1000);
      mockGetIsWebSearchMode.mockReturnValue(false);
    });

  });

  describe("Component Integration", () => {
    it("should pass correct props to NewConversation component", () => {
      renderComponent();

      const modelSelect = screen.getByLabelText("Select model");
      const promptSelect = screen.getByLabelText("Select prompt");

      expect(modelSelect).toBeInTheDocument();
      expect(promptSelect).toBeInTheDocument();
    });

    it("should pass correct props to InputSection component", () => {
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      expect(sendButton).toBeInTheDocument();
      expect(sendButton).not.toBeDisabled();
    });

    it("should maintain responsive layout classes", () => {
      renderComponent();

      // Check the main container div that has the layout classes
      const container = document.querySelector(".flex.flex-col.h-full");
      expect(container).toBeTruthy();
      expect(container?.className).toContain("max-w-full");
      expect(container?.className).toContain("md:max-w-11/12");
      expect(container?.className).toContain("xl:max-w-9/12");
    });
  });

  describe("Accessibility", () => {
    it("should have proper keyboard navigation", async () => {
      const user = userEvent.setup();
      renderComponent();

      const modelSelect = screen.getByLabelText("Select model");
      const promptSelect = screen.getByLabelText("Select prompt");
      const sendButton = screen.getByLabelText("Send message");

      // Test tab navigation
      await user.tab();
      expect(modelSelect).toHaveFocus();

      await user.tab();
      expect(promptSelect).toHaveFocus();

      await user.tab();
      expect(sendButton).toHaveFocus();
    });

    it("should have proper ARIA labels and roles", () => {
      renderComponent();

      expect(screen.getByLabelText("Select model")).toBeInTheDocument();
      expect(screen.getByLabelText("Select prompt")).toBeInTheDocument();
      expect(screen.getByLabelText("Send message")).toBeInTheDocument();
    });

    it("should announce loading state to screen readers", async () => {
      const user = userEvent.setup();
      renderComponent();

      const sendButton = screen.getByLabelText("Send message");
      await user.click(sendButton);

      await waitFor(() => {
        const spinner = screen.getByTestId("loading-spinner");
        expect(spinner).toHaveAttribute("aria-label", "Loading spinner large");
      });
    });
  });
});