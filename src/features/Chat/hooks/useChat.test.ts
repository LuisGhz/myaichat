import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';
import { DEFAULT_MODEL } from 'core/const/Models';
import * as ChatService from '../services/ChatService';
import * as ChatStore from 'store/app/ChatStore';
import * as AppStore from 'store/app/AppStore';

// Mock the entire ChatService module
vi.mock('../services/ChatService');

// Mock the store modules
vi.mock('store/app/ChatStore');
vi.mock('store/app/AppStore');

// Type the mocked modules
const chatServiceMock = vi.mocked(ChatService);
const chatStoreMock = vi.mocked(ChatStore);
const appStoreMock = vi.mocked(AppStore);

describe('useChat', () => {
  // Mock functions that will be used across tests
  let setModelMock: ReturnType<typeof vi.fn>;
  let setPromptIdMock: ReturnType<typeof vi.fn>;
  let setCurrentChatMetadataMock: ReturnType<typeof vi.fn>;
  let setMessagesMock: ReturnType<typeof vi.fn>;
  let setMaxOutputTokensMock: ReturnType<typeof vi.fn>;
  let setIsWebSearchModeMock: ReturnType<typeof vi.fn>;
  let setChatsSummaryMock: ReturnType<typeof vi.fn>;
  let addStreamingAssistantMessageMock: ReturnType<typeof vi.fn>;
  let updateStreamingAssistantMessageMock: ReturnType<typeof vi.fn>;
  let addStreamingAssistanteAndUserMessageTokensMock: ReturnType<typeof vi.fn>;
  let setIsRecordingAudioMock: ReturnType<typeof vi.fn>;
  let setIsSendingAudioMock: ReturnType<typeof vi.fn>;
  let setSideNavCollapsedMock: ReturnType<typeof vi.fn>;
  let setIsGettingNewChatMock: ReturnType<typeof vi.fn>;

  // Mock data
  const mockMessages: ChatMessage[] = [
    {
      content: 'Hello',
      role: 'User',
      completionTokens: 0,
      promptTokens: 5,
      file: '',
    },
    {
      content: 'Hi there!',
      role: 'Assistant',
      completionTokens: 10,
      promptTokens: 0,
      file: '',
    },
  ];

  const mockChatsSummary: ChatSummary[] = [
    { id: 'chat-1', fav: false },
    { id: 'chat-2', fav: true },
  ];

  const mockChatMessagesResponse: ChatMessagesRes = {
    historyMessages: mockMessages,
    model: 'gemini-2.0-flash',
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
    setChatsSummaryMock = vi.fn();
    addStreamingAssistantMessageMock = vi.fn();
    updateStreamingAssistantMessageMock = vi.fn();
    addStreamingAssistanteAndUserMessageTokensMock = vi.fn();
    setIsRecordingAudioMock = vi.fn();
    setIsSendingAudioMock = vi.fn();
    setSideNavCollapsedMock = vi.fn();
    setIsGettingNewChatMock = vi.fn();

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
    });

    // Mock useChatStoreActions return value
    chatStoreMock.useChatStoreActions.mockReturnValue({
      setModel: setModelMock,
      setMaxOutputTokens: setMaxOutputTokensMock,
      setPromptId: setPromptIdMock,
      setCurrentChatMetadata: setCurrentChatMetadataMock,
      setMessages: setMessagesMock,
      setIsWebSearchMode: setIsWebSearchModeMock,
      addStreamingAssistantMessage: addStreamingAssistantMessageMock,
      updateStreamingAssistantMessage: updateStreamingAssistantMessageMock,
      addStreamingAssistanteAndUserMessageTokens: addStreamingAssistanteAndUserMessageTokensMock,
      setIsRecordingAudio: setIsRecordingAudioMock,
      setIsSendingAudio: setIsSendingAudioMock,
    });

    // Mock useAppStore return value
    appStoreMock.useAppStore.mockReturnValue({
      sideNavCollapsed: false,
      chatsSummary: mockChatsSummary,
      isGettingNewChat: false,
    });

    // Mock useAppStoreActions return value
    appStoreMock.useAppStoreActions.mockReturnValue({
      setSideNavCollapsed: setSideNavCollapsedMock,
      setChatsSummary: setChatsSummaryMock,
      setIsGettingNewChat: setIsGettingNewChatMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hook initialization', () => {
    it('should return expected initial values from stores', () => {
      const { result } = renderUseChat();

      expect(result.current.model).toBe(DEFAULT_MODEL);
      expect(result.current.promptId).toBeUndefined();
      expect(result.current.messages).toEqual(mockMessages);
    });

    it('should return all expected functions', () => {
      const { result } = renderUseChat();

      expect(typeof result.current.resetChatData).toBe('function');
      expect(typeof result.current.getChatMessages).toBe('function');
      expect(typeof result.current.loadPreviousMessages).toBe('function');
      expect(typeof result.current.sendNewMessage).toBe('function');
      expect(typeof result.current.toggleIsWebSearchMode).toBe('function');
      expect(typeof result.current.changeMaxOutputTokens).toBe('function');
    });
  });

  describe('resetChatData', () => {
    it('should reset chat data to default values', () => {
      const { result } = renderUseChat();

      act(() => {
        result.current.resetChatData();
      });

      expect(setModelMock).toHaveBeenCalledWith(DEFAULT_MODEL);
      expect(setPromptIdMock).toHaveBeenCalledWith(undefined);
      expect(setMessagesMock).toHaveBeenCalledWith([]);
    });
  });

  describe('getChatMessages', () => {
    it('should fetch chat messages for initial load (page 0)', async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(mockChatMessagesResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages('chat-123', 0);
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith('chat-123', 0);
      expect(setMessagesMock).toHaveBeenCalledWith(mockChatMessagesResponse.historyMessages);
      expect(setMaxOutputTokensMock).toHaveBeenCalledWith(mockChatMessagesResponse.maxOutputTokens);
      expect(setIsWebSearchModeMock).toHaveBeenCalledWith(mockChatMessagesResponse.isWebSearchMode);
      expect(setCurrentChatMetadataMock).toHaveBeenCalledWith({
        totalPromptTokens: mockChatMessagesResponse.totalPromptTokens,
        totalCompletionTokens: mockChatMessagesResponse.totalCompletionTokens,
        model: 'Gemini 2.0 Flash', // Should find the model name from MODELS array
      });
    });

    it('should fetch chat messages for pagination (page > 0) without updating metadata', async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(mockChatMessagesResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages('chat-123', 1);
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith('chat-123', 1);
      expect(setMessagesMock).toHaveBeenCalledWith(mockChatMessagesResponse.historyMessages);
      // Should not update metadata for pagination
      expect(setMaxOutputTokensMock).not.toHaveBeenCalled();
      expect(setIsWebSearchModeMock).not.toHaveBeenCalled();
      expect(setCurrentChatMetadataMock).not.toHaveBeenCalled();
    });

    it('should handle null response gracefully', async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages('chat-123');
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith('chat-123', 0);
      expect(setMessagesMock).not.toHaveBeenCalled();
      expect(setCurrentChatMetadataMock).not.toHaveBeenCalled();
    });

    it('should use default page value of 0 when not provided', async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(mockChatMessagesResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages('chat-123');
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith('chat-123', 0);
    });
  });

  describe('loadPreviousMessages', () => {
    it('should prepend previous messages to existing ones and return message count', async () => {
      const previousMessages: ChatMessage[] = [
        {
          content: 'Previous message',
          role: 'User',
          completionTokens: 0,
          promptTokens: 8,
          file: '',
        },
      ];
      const responseWithPreviousMessages = {
        ...mockChatMessagesResponse,
        historyMessages: previousMessages,
      };

      chatServiceMock.getChatMessagesService.mockResolvedValue(responseWithPreviousMessages);
      const { result } = renderUseChat();

      let messageCount: number = 0;
      await act(async () => {
        messageCount = await result.current.loadPreviousMessages('chat-123', 1);
      });

      expect(chatServiceMock.getChatMessagesService).toHaveBeenCalledWith('chat-123', 1);
      expect(setMessagesMock).toHaveBeenCalledWith([...previousMessages, ...mockMessages]);
      expect(messageCount).toBe(1);
    });

    it('should return -1 when response has empty messages array', async () => {
      const emptyResponse = {
        ...mockChatMessagesResponse,
        historyMessages: [],
      };

      chatServiceMock.getChatMessagesService.mockResolvedValue(emptyResponse);
      const { result } = renderUseChat();

      let messageCount: number = 0;
      await act(async () => {
        messageCount = await result.current.loadPreviousMessages('chat-123', 1);
      });

      expect(messageCount).toBe(-1);
      expect(setMessagesMock).not.toHaveBeenCalled();
    });

    it('should return 0 when service returns null', async () => {
      chatServiceMock.getChatMessagesService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      let messageCount: number = 0;
      await act(async () => {
        messageCount = await result.current.loadPreviousMessages('chat-123', 1);
      });

      expect(messageCount).toBe(0);
      expect(setMessagesMock).not.toHaveBeenCalled();
    });
  });

  describe('sendNewMessage', () => {
    const mockSendMessageRequest: SendNewMessageReq = {
      content: 'Test message',
      maxOutputTokens: 4096,
      isWebSearchMode: false,
      model: 'gemini-2.0-flash',
      chatId: 'chat-123',
      promptId: 'prompt-456',
    };

    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    it('should send new message and add user message optimistically', async () => {
      const mockResponse: NewMessageRes = {
        chatId: 'chat-123',
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
        role: 'User',
        completionTokens: 0,
        promptTokens: 0,
        file: '',
      };
      expect(setMessagesMock).toHaveBeenCalledWith([...mockMessages, expectedUserMessage]);

      // Verify service was called with correct FormData
      expect(chatServiceMock.sendNewMessageService).toHaveBeenCalledWith(expect.any(FormData));

      expect(chatId).toBe('chat-123');
    });

    it('should handle new chat creation and update chats summary', async () => {
      const mockResponse: NewMessageRes = {
        chatId: 'new-chat-456',
        isNew: true,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      let chatId: string | undefined;
      await act(async () => {
        chatId = await result.current.sendNewMessage(mockSendMessageRequest);
      });

      const expectedNewChatSummary: ChatSummary = {
        id: 'new-chat-456',
        fav: false,
      };
      expect(setChatsSummaryMock).toHaveBeenCalledWith([...mockChatsSummary, expectedNewChatSummary]);
      expect(chatId).toBe('new-chat-456');
    });

    it('should include file in FormData when provided', async () => {
      const requestWithFile = {
        ...mockSendMessageRequest,
        file: mockFile,
      };

      const mockResponse: NewMessageRes = {
        chatId: 'chat-123',
        isNew: false,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.sendNewMessage(requestWithFile);
      });

      // Verify FormData was created with file
      const formDataCall = chatServiceMock.sendNewMessageService.mock.calls[0][0] as FormData;
      expect(formDataCall.get('file')).toBe(mockFile);
      expect(formDataCall.get('content')).toBe(mockSendMessageRequest.content);
      expect(formDataCall.get('maxOutputTokens')).toBe(String(mockSendMessageRequest.maxOutputTokens));
      expect(formDataCall.get('isWebSearchMode')).toBe(String(mockSendMessageRequest.isWebSearchMode));
      expect(formDataCall.get('model')).toBe(mockSendMessageRequest.model);
      expect(formDataCall.get('chatId')).toBe(mockSendMessageRequest.chatId);
      expect(formDataCall.get('promptId')).toBe(mockSendMessageRequest.promptId);
    });

    it('should handle optional parameters correctly', async () => {
      const minimalRequest: SendNewMessageReq = {
        content: 'Test message',
        maxOutputTokens: 4096,
        isWebSearchMode: false,
      };

      const mockResponse: NewMessageRes = {
        chatId: 'chat-123',
        isNew: false,
      };

      chatServiceMock.sendNewMessageService.mockResolvedValue(mockResponse);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.sendNewMessage(minimalRequest);
      });

      const formDataCall = chatServiceMock.sendNewMessageService.mock.calls[0][0] as FormData;
      expect(formDataCall.get('content')).toBe(minimalRequest.content);
      expect(formDataCall.get('maxOutputTokens')).toBe(String(minimalRequest.maxOutputTokens));
      expect(formDataCall.get('isWebSearchMode')).toBe(String(minimalRequest.isWebSearchMode));
      expect(formDataCall.get('model')).toBeNull();
      expect(formDataCall.get('chatId')).toBeNull();
      expect(formDataCall.get('file')).toBeNull();
      expect(formDataCall.get('promptId')).toBeNull();
    });

    it('should handle service returning null response', async () => {
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

    it('should handle service errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      chatServiceMock.sendNewMessageService.mockRejectedValue(new Error('Network error'));
      const { result } = renderUseChat();

      let chatId: string | undefined;
      await act(async () => {
        chatId = await result.current.sendNewMessage(mockSendMessageRequest);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending new message:', expect.any(Error));
      expect(chatId).toBeUndefined();
      // User message should still be added optimistically
      expect(setMessagesMock).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('toggleIsWebSearchMode', () => {
    it('should call toggleWebSearchModeService with correct parameters', async () => {
      chatServiceMock.toggleWebSearchModeService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.toggleIsWebSearchMode('chat-123', true);
      });

      expect(chatServiceMock.toggleWebSearchModeService).toHaveBeenCalledWith('chat-123', true);
    });

    it('should handle false value correctly', async () => {
      chatServiceMock.toggleWebSearchModeService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.toggleIsWebSearchMode('chat-456', false);
      });

      expect(chatServiceMock.toggleWebSearchModeService).toHaveBeenCalledWith('chat-456', false);
    });
  });

  describe('changeMaxOutputTokens', () => {
    it('should call changeMaxOutputTokensService with correct parameters', async () => {
      chatServiceMock.changeMaxOutputTokensService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.changeMaxOutputTokens('chat-123', 8192);
      });

      expect(chatServiceMock.changeMaxOutputTokensService).toHaveBeenCalledWith('chat-123', 8192);
    });

    it('should handle different token values correctly', async () => {
      chatServiceMock.changeMaxOutputTokensService.mockResolvedValue(undefined);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.changeMaxOutputTokens('chat-789', 16384);
      });

      expect(chatServiceMock.changeMaxOutputTokensService).toHaveBeenCalledWith('chat-789', 16384);
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle undefined model in getChatMessages response', async () => {
      const responseWithUndefinedModel = {
        ...mockChatMessagesResponse,
        model: 'unknown-model' as ModelsValues,
      };

      chatServiceMock.getChatMessagesService.mockResolvedValue(responseWithUndefinedModel);
      const { result } = renderUseChat();

      await act(async () => {
        await result.current.getChatMessages('chat-123', 0);
      });

      // Should handle gracefully when model is not found in MODELS array
      expect(setCurrentChatMetadataMock).toHaveBeenCalledWith({
        totalPromptTokens: responseWithUndefinedModel.totalPromptTokens,
        totalCompletionTokens: responseWithUndefinedModel.totalCompletionTokens,
        model: undefined, // Should be undefined when model not found
      });
    });

    it('should handle service errors in async functions', async () => {
      chatServiceMock.toggleWebSearchModeService.mockRejectedValue(new Error('Service error'));
      const { result } = renderUseChat();

      // Should not throw error
      await act(async () => {
        await expect(result.current.toggleIsWebSearchMode('chat-123', true)).resolves.toBeUndefined();
      });
    });
  });

  describe('user flow scenarios', () => {
    it('should handle complete new chat flow', async () => {
      // Simulate creating a new chat
      const newMessageRequest: SendNewMessageReq = {
        content: 'Hello, start new chat',
        maxOutputTokens: 4096,
        isWebSearchMode: false,
      };

      const newChatResponse: NewMessageRes = {
        chatId: 'new-chat-789',
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
        { id: 'new-chat-789', fav: false },
      ]);
      expect(newChatId).toBe('new-chat-789');
    });

    it('should handle loading and pagination flow', async () => {
      const initialResponse = { ...mockChatMessagesResponse };
      const paginationResponse = {
        ...mockChatMessagesResponse,
        historyMessages: [
          {
            content: 'Older message',
            role: 'User' as const,
            completionTokens: 0,
            promptTokens: 10,
            file: '',
          },
        ],
      };

      chatServiceMock.getChatMessagesService
        .mockResolvedValueOnce(initialResponse)
        .mockResolvedValueOnce(paginationResponse);

      const { result } = renderUseChat();

      // Load initial messages
      await act(async () => {
        await result.current.getChatMessages('chat-123', 0);
      });

      // Load previous messages
      await act(async () => {
        await result.current.loadPreviousMessages('chat-123', 1);
      });

      // Verify complete flow
      expect(setMessagesMock).toHaveBeenNthCalledWith(1, initialResponse.historyMessages);
      expect(setMessagesMock).toHaveBeenNthCalledWith(2, [
        ...paginationResponse.historyMessages,
        ...mockMessages,
      ]);
      expect(setCurrentChatMetadataMock).toHaveBeenCalledTimes(1); // Only on initial load
    });
  });
});
