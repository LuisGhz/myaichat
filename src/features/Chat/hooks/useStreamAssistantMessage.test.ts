import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStreamAssistantMessage } from "./useStreamAssistantMessage";

// Mock modules
const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}));

const chatStoreActionsMock = {
  addStreamingAssistantMessage: vi.fn(),
  updateStreamingAssistantMessage: vi.fn(),
  addStreamingAssistanteAndUserMessageTokens: vi.fn(),
};

vi.mock("store/app/ChatStore", () => ({
  useChatStoreActions: () => chatStoreActionsMock,
}));

const appStoreMock = {
  chatsSummary: [
    { id: "existing-chat-1", title: "Existing Chat 1", fav: false },
    { id: "existing-chat-2", title: "Existing Chat 2", fav: true },
  ],
};

const appStoreActionsMock = {
  setChatsSummary: vi.fn(),
  setIsGettingNewChat: vi.fn(),
};

vi.mock("store/app/AppStore", () => ({
  useAppStore: () => appStoreMock,
  useAppStoreActions: () => appStoreActionsMock,
}));

const chatParamsMock = { id: "test-chat-123" };
vi.mock("./useChatParams", () => ({
  useChatParams: () => chatParamsMock,
}));

vi.mock("../services/ChatService", () => ({
  streamAssistantMessageService: vi.fn(),
}));

import { streamAssistantMessageService } from "../services/ChatService";
const streamAssistantMessageServiceMock = vi.mocked(
  streamAssistantMessageService
);

describe("useStreamAssistantMessage", () => {
  const renderUseStreamAssistantMessage = () => {
    return renderHook(() => useStreamAssistantMessage());
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    // Reset global mocks to default state
    chatParamsMock.id = "test-chat-123";
    appStoreMock.chatsSummary = [
      { id: "existing-chat-1", title: "Existing Chat 1", fav: false },
      { id: "existing-chat-2", title: "Existing Chat 2", fav: true },
    ];
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should return correct initial values", () => {
      const { result } = renderUseStreamAssistantMessage();

      expect(result.current.fullText).toBe("");
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.startStreaming).toBe("function");
      expect(typeof result.current.stopStreaming).toBe("function");
    });
  });

  describe("startStreaming", () => {
    it("should initialize streaming state correctly", async () => {
      const mockChunks: AssistantChunkRes[] = [
        { content: "Hello ", isLastChunk: false },
        {
          content: "world!",
          isLastChunk: true,
          chatTitle: "Test Chat",
          promptTokens: 10,
          completionTokens: 15,
        },
      ];

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          for (const chunk of mockChunks) {
            onChunk(chunk);
          }
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("new-chat-456");
      });

      expect(result.current.isStreaming).toBe(false);
      expect(result.current.error).toBe(null);
      expect(
        chatStoreActionsMock.addStreamingAssistantMessage
      ).toHaveBeenCalledOnce();
      expect(streamAssistantMessageServiceMock).toHaveBeenCalledWith(
        "new-chat-456",
        expect.any(Function),
        expect.any(AbortSignal)
      );
    });

    it("should handle text streaming and update full text progressively", async () => {
      const mockChunks: AssistantChunkRes[] = [
        { content: "Hello ", isLastChunk: false },
        { content: "world", isLastChunk: false },
        {
          content: "!",
          isLastChunk: true,
          chatTitle: "Progressive Test",
          promptTokens: 8,
          completionTokens: 12,
        },
      ];

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          for (const chunk of mockChunks) {
            onChunk(chunk);
          }
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("test-chat-789");
      });

      expect(result.current.fullText).toBe("Hello world!");
    });

    it("should handle last chunk correctly and update chat summary for new chat", async () => {
      const mockLastChunk: AssistantChunkRes = {
        content: "Final response",
        isLastChunk: true,
        chatTitle: "New Chat Title",
        promptTokens: 20,
        completionTokens: 25,
      };

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk(mockLastChunk);
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("brand-new-chat");
      });

      expect(appStoreActionsMock.setIsGettingNewChat).toHaveBeenCalledWith(
        false
      );
      expect(
        chatStoreActionsMock.addStreamingAssistanteAndUserMessageTokens
      ).toHaveBeenCalledWith(20, 25);
      expect(appStoreActionsMock.setChatsSummary).toHaveBeenCalledWith([
        ...appStoreMock.chatsSummary,
        { id: "brand-new-chat", title: "New Chat Title", fav: false },
      ]);
    });

    it("should navigate to new chat when params.id is not present", async () => {
      chatParamsMock.id = "";

      const mockLastChunk: AssistantChunkRes = {
        content: "Response for new chat",
        isLastChunk: true,
        chatTitle: "Navigation Test",
        promptTokens: 15,
        completionTokens: 18,
      };

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk(mockLastChunk);
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("navigation-test-chat");
      });

      expect(navigateMock).toHaveBeenCalledWith("/chat/navigation-test-chat", {
        state: { fromStream: true },
      });
    });

    it("should not update chat summary if chat already exists", async () => {
      const mockLastChunk: AssistantChunkRes = {
        content: "Response for existing chat",
        isLastChunk: true,
        chatTitle: "Should Not Update",
        promptTokens: 12,
        completionTokens: 16,
      };

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk(mockLastChunk);
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("existing-chat-1");
      });

      expect(appStoreActionsMock.setChatsSummary).not.toHaveBeenCalled();
    });

    it("should handle streaming errors correctly", async () => {
      const errorMessage = "Network error occurred";
      streamAssistantMessageServiceMock.mockRejectedValue(
        new Error(errorMessage)
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("error-chat");
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isStreaming).toBe(false);
    });

    it("should not set error for AbortError", async () => {
      const abortError = new Error("Operation was aborted");
      abortError.name = "AbortError";
      streamAssistantMessageServiceMock.mockRejectedValue(abortError);

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("abort-test-chat");
      });

      expect(result.current.error).toBe(null);
      expect(result.current.isStreaming).toBe(false);
    });

    it("should reset state when starting new stream", async () => {
      // First, set some state by running a stream with error
      streamAssistantMessageServiceMock.mockRejectedValue(
        new Error("Previous error")
      );
      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("error-chat");
      });

      expect(result.current.error).toBe("Previous error");

      // Now start a successful stream
      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk({
            content: "Success",
            isLastChunk: true,
            chatTitle: "Success Chat",
          });
        }
      );

      await act(async () => {
        await result.current.startStreaming("success-chat");
      });

      expect(result.current.error).toBe(null);
      expect(result.current.fullText).toBe("Success");
    });
  });

  describe("stopStreaming", () => {
    it("should stop streaming and reset state", () => {
      const { result } = renderUseStreamAssistantMessage();

      // Start with streaming state
      act(() => {
        result.current.startStreaming("test-chat");
      });

      // Stop streaming
      act(() => {
        result.current.stopStreaming();
      });

      expect(result.current.isStreaming).toBe(false);
    });

    it("should handle stopStreaming when no active stream exists", () => {
      const { result } = renderUseStreamAssistantMessage();

      // Should not throw error when called without active stream
      expect(() => {
        act(() => {
          result.current.stopStreaming();
        });
      }).not.toThrow();

      expect(result.current.isStreaming).toBe(false);
    });

    it("should be memoized and maintain stable reference", () => {
      const { result, rerender } = renderUseStreamAssistantMessage();
      const firstStopStreaming = result.current.stopStreaming;

      rerender();
      const secondStopStreaming = result.current.stopStreaming;

      expect(firstStopStreaming).toBe(secondStopStreaming);
    });
  });

  describe("user flow scenarios", () => {
    it("should handle complete streaming flow for new chat creation", async () => {
      chatParamsMock.id = "";

      const mockChunks: AssistantChunkRes[] = [
        { content: "Creating ", isLastChunk: false },
        { content: "new ", isLastChunk: false },
        {
          content: "chat!",
          isLastChunk: true,
          chatTitle: "Complete Flow Test",
          promptTokens: 25,
          completionTokens: 30,
        },
      ];

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          for (const chunk of mockChunks) {
            onChunk(chunk);
          }
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("complete-flow-chat");
      });

      // Verify complete flow
      expect(result.current.fullText).toBe("Creating new chat!");
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.error).toBe(null);
      expect(
        chatStoreActionsMock.addStreamingAssistantMessage
      ).toHaveBeenCalledOnce();
      expect(appStoreActionsMock.setIsGettingNewChat).toHaveBeenCalledWith(
        false
      );
      expect(
        chatStoreActionsMock.addStreamingAssistanteAndUserMessageTokens
      ).toHaveBeenCalledWith(25, 30);
      expect(navigateMock).toHaveBeenCalledWith("/chat/complete-flow-chat", {
        state: { fromStream: true },
      });
      expect(appStoreActionsMock.setChatsSummary).toHaveBeenCalledWith([
        ...appStoreMock.chatsSummary,
        { id: "complete-flow-chat", title: "Complete Flow Test", fav: false },
      ]);
    });

    it("should handle streaming with missing optional properties in last chunk", async () => {
      const mockLastChunk: AssistantChunkRes = {
        content: "Response without tokens",
        isLastChunk: true,
        chatTitle: "No Tokens Chat",
        // Missing promptTokens and completionTokens
      };

      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk(mockLastChunk);
        }
      );

      const { result } = renderUseStreamAssistantMessage();

      await act(async () => {
        await result.current.startStreaming("no-tokens-chat");
      });

      expect(
        chatStoreActionsMock.addStreamingAssistanteAndUserMessageTokens
      ).toHaveBeenCalledWith(0, 0);
      expect(result.current.fullText).toBe("Response without tokens");
    });

    it("should handle multiple consecutive streaming sessions", async () => {
      const { result } = renderUseStreamAssistantMessage();

      // First streaming session
      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk({
            content: "First response",
            isLastChunk: true,
            chatTitle: "First Chat",
          });
        }
      );

      await act(async () => {
        await result.current.startStreaming("first-session");
      });

      expect(result.current.fullText).toBe("First response");

      // Second streaming session
      streamAssistantMessageServiceMock.mockImplementation(
        async (
          _chatId: string,
          onChunk: (chunk: AssistantChunkRes) => void
        ) => {
          onChunk({
            content: "Second response",
            isLastChunk: true,
            chatTitle: "Second Chat",
          });
        }
      );

      await act(async () => {
        await result.current.startStreaming("second-session");
      });

      expect(result.current.fullText).toBe("Second response");
      expect(
        chatStoreActionsMock.addStreamingAssistantMessage
      ).toHaveBeenCalledTimes(2);
    });
  });
});
