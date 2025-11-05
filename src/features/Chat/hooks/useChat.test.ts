import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChat } from "./useChat";
import { DEFAULT_MODEL } from "core/const/Models";
import * as ChatService from "../services/ChatService";
import * as ChatStore from "store/app/ChatStore";
import * as AppStore from "store/app/AppStore";

// Mock the entire ChatService module
vi.mock("../services/ChatService");

// Mock the store modules
vi.mock("store/app/ChatStore");
vi.mock("store/app/AppStore");

// Mock useAppMessage to capture errorMessage calls
const errorMessageMock = vi.fn();
vi.mock("shared/hooks/useAppMessage", () => ({
  useAppMessage: () => ({
    errorMessage: errorMessageMock,
  }),
}));

// Mock useNavigate to avoid wrapping tests in a Router
const navigateMock = vi.fn();
vi.mock("react-router", () => ({
  ...vi.importActual("react-router"),
  useNavigate: () => navigateMock,
}));

// Type the mocked modules
const chatServiceMock = vi.mocked(ChatService);
const chatStoreMock = vi.mocked(ChatStore);
const appStoreMock = vi.mocked(AppStore);

describe("useChat", () => {
  // Mock functions that will be used across tests
  let setModelMock: ReturnType<typeof vi.fn>;
  let setPromptIdMock: ReturnType<typeof vi.fn>;
  let setCurrentChatMetadataMock: ReturnType<typeof vi.fn>;
  let setMessagesMock: ReturnType<typeof vi.fn>;
  let setMaxOutputTokensMock: ReturnType<typeof vi.fn>;
  let setIsWebSearchModeMock: ReturnType<typeof vi.fn>;
  let setSelectedFileMock: ReturnType<typeof vi.fn>;
  let setChatsSummaryMock: ReturnType<typeof vi.fn>;
  let addStreamingAssistantMessageMock: ReturnType<typeof vi.fn>;
  let updateStreamingAssistantMessageMock: ReturnType<typeof vi.fn>;
  let addStreamingAssistanteAndUserMessageTokensMock: ReturnType<typeof vi.fn>;
  let setIsRecordingAudioMock: ReturnType<typeof vi.fn>;
  let setIsSendingAudioMock: ReturnType<typeof vi.fn>;
  let setSideNavCollapsedMock: ReturnType<typeof vi.fn>;
  let setIsGettingNewChatMock: ReturnType<typeof vi.fn>;
  let setIsStreamingMock: ReturnType<typeof vi.fn>;

  // Mock data
  const mockMessages: ChatMessage[] = [
    {
      content: "Hello",
      role: "User",
      completionTokens: 0,
      promptTokens: 5,
      file: "",
    },
    {
      content: "Hi there!",
      role: "Assistant",
      completionTokens: 10,
      promptTokens: 0,
      file: "",
    },
  ];

  const mockChatsSummary: ChatSummary[] = [
    { id: "chat-1", fav: false },
    { id: "chat-2", fav: true },
  ];

  const mockChatMessagesResponse: ChatMessagesRes = {
    historyMessages: mockMessages,
    model: "gemini-2.0-flash",
    maxOutputTokens: 4096,
    isWebSearchMode: false,
    totalPromptTokens: 100,
    totalCompletionTokens: 200,
  };

  const renderUseChat = () => {
    return renderHook(() => useChat());
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock functions
    setModelMock = vi.fn();
    setPromptIdMock = vi.fn();
    setCurrentChatMetadataMock = vi.fn();
    setMessagesMock = vi.fn();
    setMaxOutputTokensMock = vi.fn();
    setIsWebSearchModeMock = vi.fn();
    setSelectedFileMock = vi.fn();
    setChatsSummaryMock = vi.fn();
    addStreamingAssistantMessageMock = vi.fn();
    updateStreamingAssistantMessageMock = vi.fn();
    addStreamingAssistanteAndUserMessageTokensMock = vi.fn();
    setIsRecordingAudioMock = vi.fn();
    setIsSendingAudioMock = vi.fn();
    setSideNavCollapsedMock = vi.fn();
    setIsGettingNewChatMock = vi.fn();
    setIsStreamingMock = vi.fn();

    // Mock useChatStore return value
    chatStoreMock.useChatStore.mockReturnValue({
      model: DEFAULT_MODEL,
      maxOutputTokens: 4096,
      isWebSearchMode: false,
      promptId: undefined,
      currentChatMetadata: undefined,
      messages: mockMessages,
      isRecordingAudio: false,
      isSendingAudio: false,
      selectedFile: null,
      isStreaming: false,
    });

    // Mock useChatStoreActions return value
    chatStoreMock.useChatStoreActions.mockReturnValue({
      setModel: setModelMock,
      setMaxOutputTokens: setMaxOutputTokensMock,
      setPromptId: setPromptIdMock,
      setCurrentChatMetadata: setCurrentChatMetadataMock,
      setMessages: setMessagesMock,
      setIsWebSearchMode: setIsWebSearchModeMock,
      setSelectedFile: setSelectedFileMock,
      addStreamingAssistantMessage: addStreamingAssistantMessageMock,
      updateStreamingAssistantMessage: updateStreamingAssistantMessageMock,
      addStreamingAssistanteAndUserMessageTokens:
        addStreamingAssistanteAndUserMessageTokensMock,
      setIsRecordingAudio: setIsRecordingAudioMock,
      setIsSendingAudio: setIsSendingAudioMock,
      setIsStreaming: setIsStreamingMock,
    });

    // Mock useAppStore return value
    appStoreMock.useAppStore.mockReturnValue({
      sideNavCollapsed: false,
      chatsSummary: mockChatsSummary,
      isGettingNewChat: false,
      messageApi: null,
    });

    // Mock useAppStoreActions return value
    appStoreMock.useAppStoreActions.mockReturnValue({
      setSideNavCollapsed: setSideNavCollapsedMock,
      setChatsSummary: setChatsSummaryMock,
      setIsGettingNewChat: setIsGettingNewChatMock,
      setMessageApi: vi.fn(),
      closeSideNav: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("hook initialization", () => {
    it("should return expected initial values from stores", () => {
      const { result } = renderUseChat();

      expect(result.current.model).toBe(DEFAULT_MODEL);
      expect(result.current.promptId).toBeUndefined();
      expect(result.current.messages).toEqual(mockMessages);
    });

    it("should return all expected functions", () => {
      const { result } = renderUseChat();

      expect(typeof result.current.resetChatData).toBe("function");
      expect(typeof result.current.getChatMessages).toBe("function");
      expect(typeof result.current.loadPreviousMessages).toBe("function");
      expect(typeof result.current.sendNewMessage).toBe("function");
      expect(typeof result.current.toggleIsWebSearchMode).toBe("function");
      expect(typeof result.current.changeMaxOutputTokens).toBe("function");
    });
  });

  describe("resetChatData", () => {
    it("should reset chat data to default values", () => {
      const { result } = renderUseChat();

      act(() => {
        result.current.resetChatData();
      });

      expect(setModelMock).toHaveBeenCalledWith(DEFAULT_MODEL);
      expect(setPromptIdMock).toHaveBeenCalledWith(undefined);
      expect(setMessagesMock).toHaveBeenCalledWith([]);
      expect(setSelectedFileMock).toHaveBeenCalledWith(null);
    });

    it("should clear selected file when resetting chat data", () => {
      const { result } = renderUseChat();

      act(() => {
        result.current.resetChatData();
      });

      expect(setSelectedFileMock).toHaveBeenCalledWith(null);
      expect(setSelectedFileMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("getChatMessages", () => {
    it("should fetch chat messages for initial load (page 0)", async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(
        mockChatMessagesResponse
      );
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages("chat-123", 0);
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith(
        "chat-123",
        0
      );
      expect(setMessagesMock).toHaveBeenCalledWith(
        mockChatMessagesResponse.historyMessages
      );
      expect(setMaxOutputTokensMock).toHaveBeenCalledWith(
        mockChatMessagesResponse.maxOutputTokens
      );
      expect(setIsWebSearchModeMock).toHaveBeenCalledWith(
        mockChatMessagesResponse.isWebSearchMode
      );
      expect(setCurrentChatMetadataMock).toHaveBeenCalledWith({
        totalPromptTokens: mockChatMessagesResponse.totalPromptTokens,
        totalCompletionTokens: mockChatMessagesResponse.totalCompletionTokens,
        model: "Gemini 2.0 Flash", // Should find the model name from MODELS array
      });
    });

    it("should fetch chat messages for pagination (page > 0) without updating metadata", async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(
        mockChatMessagesResponse
      );
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages("chat-123", 1);
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith(
        "chat-123",
        1
      );
      expect(setMessagesMock).toHaveBeenCalledWith(
        mockChatMessagesResponse.historyMessages
      );
      // Should not update metadata for pagination
      expect(setMaxOutputTokensMock).not.toHaveBeenCalled();
      expect(setIsWebSearchModeMock).not.toHaveBeenCalled();
      expect(setCurrentChatMetadataMock).not.toHaveBeenCalled();
    });

    it("should handle null response gracefully", async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages("chat-123");
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith(
        "chat-123",
        0
      );
      expect(setMessagesMock).not.toHaveBeenCalled();
      expect(setCurrentChatMetadataMock).not.toHaveBeenCalled();
    });

    it("should use default page value of 0 when not provided", async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(
        mockChatMessagesResponse
      );
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages("chat-123");
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith(
        "chat-123",
        0
      );
    });
  });

  describe("loadPreviousMessages", () => {
    it("should prepend previous messages to existing ones and return message count", async () => {
      const previousMessages: ChatMessage[] = [
        {
          content: "Previous message",
          role: "User",
          completionTokens: 0,
          promptTokens: 8,
          file: "",
        },
      ];
      const responseWithPreviousMessages = {
        ...mockChatMessagesResponse,
        historyMessages: previousMessages,
      };

      chatServiceMock.getChatMessagesService.mockResolvedValue(
        responseWithPreviousMessages
      );
      const { result } = renderUseChat();

      let messageCount: number = 0;
      await act(async () => {
        messageCount = await result.current.loadPreviousMessages("chat-123", 1);
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith(
        "chat-123",
        1
      );
      expect(setMessagesMock).toHaveBeenCalledWith([
        ...previousMessages,
        ...mockMessages,
      ]);
      expect(messageCount).toBe(1);
    });

    it("should return -1 when response has empty messages array", async () => {
      const emptyResponse = {
        ...mockChatMessagesResponse,
        historyMessages: [],
      };

      chatServiceMock.getChatMessagesService.mockResolvedValue(emptyResponse);
      const { result } = renderUseChat();

      let messageCount: number = 0;
      await act(async () => {
        messageCount = await result.current.loadPreviousMessages("chat-123", 1);
      });

      expect(messageCount).toBe(-1);
      expect(setMessagesMock).not.toHaveBeenCalled();
    });

    it("should return 0 when service returns null", async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      let messageCount: number = 0;
      await act(async () => {
        messageCount = await result.current.loadPreviousMessages("chat-123", 1);
      });

      expect(messageCount).toBe(0);
      expect(setMessagesMock).not.toHaveBeenCalled();
    });
  });

  describe("sendNewMessage", () => {
    const mockSendMessageRequest: SendNewMessageReq = {
      content: "Test message",
      maxOutputTokens: 4096,
      isWebSearchMode: false,
      model: "gemini-2.0-flash",
      chatId: "chat-123",
      promptId: "prompt-456",
      file: null,
    };

    const mockFile = new File(["test"], "test.txt", { type: "text/plain" });

    it("should send new message and add user message optimistically", async () => {
      const mockResponse: NewMessageRes = {
        chatId: "chat-123",
        isNew: false,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      let chatId: string | undefined;
      await act(async () => {
        chatId = await result.current.sendNewMessage(mockSendMessageRequest);
      });

      // Verify the user message was added optimistically
      const expectedUserMessage: ChatMessage = {
        content: mockSendMessageRequest.content,
        role: "User",
        completionTokens: 0,
        promptTokens: 0,
        file: "",
      };
      expect(setMessagesMock).toHaveBeenCalledWith([
        ...mockMessages,
        expectedUserMessage,
      ]);

      // Verify service was called with correct FormData
      expect(chatServiceMock.sendNewMessageService).toHaveBeenCalledWith(
        expect.any(FormData)
      );

      expect(chatId).toBe("chat-123");
    });

    it("should handle new chat creation and update chats summary", async () => {
      const mockResponse: NewMessageRes = {
        chatId: "new-chat-456",
        isNew: true,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      let chatId: string | undefined;
      await act(async () => {
        chatId = await result.current.sendNewMessage(mockSendMessageRequest);
      });

      const expectedNewChatSummary: ChatSummary = {
        id: "new-chat-456",
        fav: false,
      };
      expect(setChatsSummaryMock).toHaveBeenCalledWith([
        ...mockChatsSummary,
        expectedNewChatSummary,
      ]);
      expect(chatId).toBe("new-chat-456");
    });

    it("should include file in FormData when provided", async () => {
      const requestWithFile = {
        ...mockSendMessageRequest,
        file: mockFile,
      };

      const mockResponse: NewMessageRes = {
        chatId: "chat-123",
        isNew: false,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.sendNewMessage(requestWithFile);
      });

      // Verify FormData was created with file
      const formDataCall = chatServiceMock.sendNewMessageService.mock
        .calls[0][0] as FormData;
      expect(formDataCall.get("file")).toBe(mockFile);
      expect(formDataCall.get("content")).toBe(mockSendMessageRequest.content);
      expect(formDataCall.get("maxOutputTokens")).toBe(
        String(mockSendMessageRequest.maxOutputTokens)
      );
      expect(formDataCall.get("isWebSearchMode")).toBe(
        String(mockSendMessageRequest.isWebSearchMode)
      );
      expect(formDataCall.get("model")).toBe(mockSendMessageRequest.model);
      expect(formDataCall.get("chatId")).toBe(mockSendMessageRequest.chatId);
      expect(formDataCall.get("promptId")).toBe(
        mockSendMessageRequest.promptId
      );
    });

    it("should handle optional parameters correctly", async () => {
      const minimalRequest: SendNewMessageReq = {
        content: "Test message",
        maxOutputTokens: 4096,
        isWebSearchMode: false,
        file: null,
      };

      const mockResponse: NewMessageRes = {
        chatId: "chat-123",
        isNew: false,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.sendNewMessage(minimalRequest);
      });

      const formDataCall = chatServiceMock.sendNewMessageService.mock
        .calls[0][0] as FormData;
      expect(formDataCall.get("content")).toBe(minimalRequest.content);
      expect(formDataCall.get("maxOutputTokens")).toBe(
        String(minimalRequest.maxOutputTokens)
      );
      expect(formDataCall.get("isWebSearchMode")).toBe(
        String(minimalRequest.isWebSearchMode)
      );
      expect(formDataCall.get("model")).toBeNull();
      expect(formDataCall.get("chatId")).toBeNull();
      expect(formDataCall.get("file")).toBeNull();
      expect(formDataCall.get("promptId")).toBeNull();
    });

    it("should handle service returning null response", async () => {
      chatServiceMock.sendNewMessageService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      let chatId: string | undefined;
      await act(async () => {
        chatId = await result.current.sendNewMessage(mockSendMessageRequest);
      });

      expect(chatId).toBeUndefined();
      // User message should still be added optimistically
      expect(setMessagesMock).toHaveBeenCalled();
    });

    it("should handle service errors gracefully", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      chatServiceMock.sendNewMessageService.mockRejectedValue(
        new Error("Network error")
      );
      const { result } = renderUseChat();

      let chatId: string | undefined;
      await act(async () => {
        chatId = await result.current.sendNewMessage(mockSendMessageRequest);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending new message:",
        expect.any(Error)
      );
      expect(chatId).toBeUndefined();
      // User message should still be added optimistically
      expect(setMessagesMock).toHaveBeenCalled();
      // Should call errorMessage with proper text
      expect(errorMessageMock).toHaveBeenCalledWith("Failed to send message.");

      consoleErrorSpy.mockRestore();
    });
  });

  describe("toggleIsWebSearchMode", () => {
    it("should call toggleWebSearchModeService with correct parameters", async () => {
      chatServiceMock.toggleWebSearchModeService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.toggleIsWebSearchMode("chat-123", true);
      });

      expect(chatServiceMock.toggleWebSearchModeService).toHaveBeenCalledWith(
        "chat-123",
        true
      );
    });

    it("should handle false value correctly", async () => {
      chatServiceMock.toggleWebSearchModeService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.toggleIsWebSearchMode("chat-456", false);
      });

      expect(chatServiceMock.toggleWebSearchModeService).toHaveBeenCalledWith(
        "chat-456",
        false
      );
    });
  });

  describe("changeMaxOutputTokens", () => {
    it("should call changeMaxOutputTokensService with correct parameters", async () => {
      chatServiceMock.changeMaxOutputTokensService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.changeMaxOutputTokens("chat-123", 8192);
      });

      expect(chatServiceMock.changeMaxOutputTokensService).toHaveBeenCalledWith(
        "chat-123",
        8192
      );
    });

    it("should handle different token values correctly", async () => {
      chatServiceMock.changeMaxOutputTokensService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.changeMaxOutputTokens("chat-789", 16384);
      });

      expect(chatServiceMock.changeMaxOutputTokensService).toHaveBeenCalledWith(
        "chat-789",
        16384
      );
    });
  });

  describe("edge cases and error scenarios", () => {
    it("should handle undefined model in getChatMessages response", async () => {
      const responseWithUndefinedModel = {
        ...mockChatMessagesResponse,
        model: "unknown-model" as ModelsValues,
      };

      chatServiceMock.getChatMessagesService.mockResolvedValue(
        responseWithUndefinedModel
      );
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages("chat-123", 0);
      });

      // Should handle gracefully when model is not found in MODELS array
      expect(setCurrentChatMetadataMock).toHaveBeenCalledWith({
        totalPromptTokens: responseWithUndefinedModel.totalPromptTokens,
        totalCompletionTokens: responseWithUndefinedModel.totalCompletionTokens,
        model: undefined, // Should be undefined when model not found
      });
    });

    it("should handle service errors in async functions", async () => {
      chatServiceMock.toggleWebSearchModeService.mockRejectedValue(
        new Error("Service error")
      );
      const { result } = renderUseChat();

      // Should not throw error
      await act(async () => {
        await expect(
          result.current.toggleIsWebSearchMode("chat-123", true)
        ).resolves.toBeUndefined();
      });
      expect(errorMessageMock).toHaveBeenCalledWith(
        "Failed to toggle web search mode."
      );
    });
  });

  describe("user flow scenarios", () => {
    it("should handle complete new chat flow", async () => {
      // Simulate creating a new chat
      const newMessageRequest: SendNewMessageReq = {
        content: "Hello, start new chat",
        maxOutputTokens: 4096,
        isWebSearchMode: false,
        file: null,
      };

      const newChatResponse: NewMessageRes = {
        chatId: "new-chat-789",
        isNew: true,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(newChatResponse);
      const { result } = renderUseChat();

      // Reset chat data first
      act(() => {
        result.current.resetChatData();
      });

      // Send new message
      let newChatId: string | undefined;
      await act(async () => {
        newChatId = await result.current.sendNewMessage(newMessageRequest);
      });

      // Verify complete flow
      expect(setModelMock).toHaveBeenCalledWith(DEFAULT_MODEL);
      expect(setPromptIdMock).toHaveBeenCalledWith(undefined);
      expect(setMessagesMock).toHaveBeenCalledWith([]);
      expect(setChatsSummaryMock).toHaveBeenCalledWith([
        ...mockChatsSummary,
        { id: "new-chat-789", fav: false },
      ]);
      expect(newChatId).toBe("new-chat-789");
    });

    it("should handle loading and pagination flow", async () => {
      const initialResponse = { ...mockChatMessagesResponse };
      const paginationResponse = {
        ...mockChatMessagesResponse,
        historyMessages: [
          {
            content: "Older message",
            role: "User" as const,
            completionTokens: 0,
            promptTokens: 10,
            file: "",
          },
        ],
      };

      chatServiceMock.getChatMessagesService
        .mockResolvedValueOnce(initialResponse)
        .mockResolvedValueOnce(paginationResponse);

      const { result } = renderUseChat();

      // Load initial messages
      await act(async () => {
        await result.current.getChatMessages("chat-123", 0);
      });

      // Load previous messages
      await act(async () => {
        await result.current.loadPreviousMessages("chat-123", 1);
      });

      // Verify complete flow
      expect(setMessagesMock).toHaveBeenNthCalledWith(
        1,
        initialResponse.historyMessages
      );
      expect(setMessagesMock).toHaveBeenNthCalledWith(2, [
        ...paginationResponse.historyMessages,
        ...mockMessages,
      ]);
      expect(setCurrentChatMetadataMock).toHaveBeenCalledTimes(1); // Only on initial load
    });
  });

  describe("setSelectedFile functionality", () => {
    const createMockFile = (
      name: string,
      type: string,
      size: number = 1024
    ) => {
      const content = new Array(size).fill("a").join("");
      return new File([content], name, { type, lastModified: Date.now() });
    };

    describe("file handling through resetChatData", () => {
      it("should call setSelectedFile with null when resetting chat data", () => {
        const { result } = renderUseChat();

        act(() => {
          result.current.resetChatData();
        });

        expect(setSelectedFileMock).toHaveBeenCalledWith(null);
      });
    });

    describe("file integration with sendNewMessage", () => {
      it("should handle sendNewMessage with null file", async () => {
        const request: SendNewMessageReq = {
          content: "Test message",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: null,
        };

        const mockResponse: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
        const { result } = renderUseChat();

        await act(async () => {
          await result.current.sendNewMessage(request);
        });

        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        expect(formDataCall.get("file")).toBeNull();
        expect(formDataCall.get("content")).toBe(request.content);
      });

      it("should handle sendNewMessage with valid file", async () => {
        const mockFile = createMockFile("test.jpg", "image/jpeg");
        const request: SendNewMessageReq = {
          content: "Test message with file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: mockFile,
        };

        const mockResponse: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
        const { result } = renderUseChat();

        await act(async () => {
          await result.current.sendNewMessage(request);
        });

        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        expect(formDataCall.get("file")).toBe(mockFile);
        expect(formDataCall.get("content")).toBe(request.content);
      });

      it("should handle different file types correctly", async () => {
        const testCases = [
          { name: "document.pdf", type: "application/pdf" },
          { name: "image.png", type: "image/png" },
          { name: "text.txt", type: "text/plain" },
        ];

        for (const testCase of testCases) {
          const mockFile = createMockFile(testCase.name, testCase.type);
          const request: SendNewMessageReq = {
            content: `Test with ${testCase.name}`,
            maxOutputTokens: 4096,
            isWebSearchMode: false,
            file: mockFile,
          };

          const mockResponse: NewMessageRes = {
            chatId: "chat-123",
            isNew: false,
          };

          chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
          const { result } = renderUseChat();

          await act(async () => {
            await result.current.sendNewMessage(request);
          });

          const formDataCall = chatServiceMock.sendNewMessageService.mock
            .calls[0][0] as FormData;
          const sentFile = formDataCall.get("file") as File;
          expect(sentFile.name).toBe(testCase.name);
          expect(sentFile.type).toBe(testCase.type);

          // Clear mock for next iteration
          vi.clearAllMocks();
          // Re-setup the mock for next iteration
          chatStoreMock.useChatStoreActions.mockReturnValue({
            setModel: setModelMock,
            setMaxOutputTokens: setMaxOutputTokensMock,
            setPromptId: setPromptIdMock,
            setCurrentChatMetadata: setCurrentChatMetadataMock,
            setMessages: setMessagesMock,
            setIsWebSearchMode: setIsWebSearchModeMock,
            setSelectedFile: setSelectedFileMock,
            addStreamingAssistantMessage: addStreamingAssistantMessageMock,
            updateStreamingAssistantMessage:
              updateStreamingAssistantMessageMock,
            addStreamingAssistanteAndUserMessageTokens:
              addStreamingAssistanteAndUserMessageTokensMock,
            setIsRecordingAudio: setIsRecordingAudioMock,
            setIsSendingAudio: setIsSendingAudioMock,
            setIsStreaming: setIsStreamingMock,
          });
        }
      });

      it("should handle large files correctly", async () => {
        const largeFile = createMockFile(
          "large-image.jpg",
          "image/jpeg",
          5 * 1024 * 1024
        ); // 5MB
        const request: SendNewMessageReq = {
          content: "Test with large file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: largeFile,
        };

        const mockResponse: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
        const { result } = renderUseChat();

        await act(async () => {
          await result.current.sendNewMessage(request);
        });

        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        const sentFile = formDataCall.get("file") as File;
        expect(sentFile.size).toBe(5 * 1024 * 1024);
        expect(sentFile.name).toBe("large-image.jpg");
      });
    });

    describe("edge cases and error scenarios", () => {
      it("should handle sendNewMessage when file is explicitly set to null", async () => {
        const request: SendNewMessageReq = {
          content: "Test message",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: null,
        };

        const mockResponse: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
        const { result } = renderUseChat();

        await act(async () => {
          await result.current.sendNewMessage(request);
        });

        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        expect(formDataCall.get("file")).toBeNull();
      });

      it("should handle file with special characters in name", async () => {
        const specialFile = createMockFile(
          "test file (1) [copy].jpg",
          "image/jpeg"
        );
        const request: SendNewMessageReq = {
          content: "Test with special filename",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: specialFile,
        };

        const mockResponse: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
        const { result } = renderUseChat();

        await act(async () => {
          await result.current.sendNewMessage(request);
        });

        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        const sentFile = formDataCall.get("file") as File;
        expect(sentFile.name).toBe("test file (1) [copy].jpg");
      });

      it("should handle empty file", async () => {
        const emptyFile = createMockFile("empty.txt", "text/plain", 0);
        const request: SendNewMessageReq = {
          content: "Test with empty file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: emptyFile,
        };

        const mockResponse: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
        const { result } = renderUseChat();

        await act(async () => {
          await result.current.sendNewMessage(request);
        });

        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        const sentFile = formDataCall.get("file") as File;
        expect(sentFile.size).toBe(0);
        expect(sentFile.name).toBe("empty.txt");
      });
    });

    describe("user flow scenarios with files", () => {
      it("should handle complete flow: reset -> send with file -> send without file", async () => {
        const { result } = renderUseChat();

        // Step 1: Reset chat data (clears any selected file)
        act(() => {
          result.current.resetChatData();
        });
        expect(setSelectedFileMock).toHaveBeenCalledWith(null);

        // Step 2: Send message with file
        const fileRequest: SendNewMessageReq = {
          content: "Message with file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: createMockFile("document.pdf", "application/pdf"),
        };

        const mockResponseWithFile: NewMessageRes = {
          chatId: "chat-123",
          isNew: false,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(
          mockResponseWithFile
        );

        await act(async () => {
          await result.current.sendNewMessage(fileRequest);
        });

        const firstFormData = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        expect(firstFormData.get("file")).toBeTruthy();

        // Step 3: Send message without file
        const noFileRequest: SendNewMessageReq = {
          content: "Message without file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: null,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(
          mockResponseWithFile
        );

        await act(async () => {
          await result.current.sendNewMessage(noFileRequest);
        });

        const secondFormData = chatServiceMock.sendNewMessageService.mock
          .calls[1][0] as FormData;
        expect(secondFormData.get("file")).toBeNull();
      });

      it("should handle new chat creation with file attachment", async () => {
        const mockFile = createMockFile("startup-doc.pdf", "application/pdf");
        const request: SendNewMessageReq = {
          content: "Start new chat with file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: mockFile,
        };

        const newChatResponse: NewMessageRes = {
          chatId: "new-chat-789",
          isNew: true,
        };

        chatServiceMock.sendNewMessageService.mockResolvedValue(
          newChatResponse
        );
        const { result } = renderUseChat();

        let returnedChatId: string | undefined;
        await act(async () => {
          returnedChatId = await result.current.sendNewMessage(request);
        });

        // Verify file was sent correctly
        const formDataCall = chatServiceMock.sendNewMessageService.mock
          .calls[0][0] as FormData;
        const sentFile = formDataCall.get("file") as File;
        expect(sentFile.name).toBe("startup-doc.pdf");

        // Verify new chat was created
        expect(returnedChatId).toBe("new-chat-789");
        expect(setChatsSummaryMock).toHaveBeenCalledWith([
          ...mockChatsSummary,
          { id: "new-chat-789", fav: false },
        ]);
      });

      it("should handle service error with file attachment gracefully", async () => {
        const consoleErrorSpy = vi
          .spyOn(console, "error")
          .mockImplementation(() => {});
        const mockFile = createMockFile("error-file.jpg", "image/jpeg");
        const request: SendNewMessageReq = {
          content: "Test error handling with file",
          maxOutputTokens: 4096,
          isWebSearchMode: false,
          file: mockFile,
        };

        chatServiceMock.sendNewMessageService.mockRejectedValue(
          new Error("Network error")
        );
        const { result } = renderUseChat();

        let returnedChatId: string | undefined;
        await act(async () => {
          returnedChatId = await result.current.sendNewMessage(request);
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error sending new message:",
          expect.any(Error)
        );
        expect(returnedChatId).toBeUndefined();

        // User message should still be added optimistically
        expect(setMessagesMock).toHaveBeenCalled();

        // Should call errorMessage with proper text
        expect(errorMessageMock).toHaveBeenCalledWith("Failed to send message.");

        consoleErrorSpy.mockRestore();
      });
    });
  });
});
