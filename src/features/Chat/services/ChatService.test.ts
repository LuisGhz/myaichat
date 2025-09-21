import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient } from "api";
import {
  getChatMessagesService,
  sendNewMessageService,
  streamAssistantMessageService,
  toggleWebSearchModeService,
  changeMaxOutputTokensService,
  deleteChatService,
  transcribeAudioService,
} from "./ChatService";

// Mock the apiClient
vi.mock("api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    postFormData: vi.fn(),
    del: vi.fn(),
    getStream: vi.fn(),
  },
}));

describe("ChatService", () => {
  const apiClientMock = apiClient as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
    postFormData: ReturnType<typeof vi.fn>;
    del: ReturnType<typeof vi.fn>;
    getStream: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getChatMessagesService", () => {
    const mockChatMessagesRes: ChatMessagesRes = {
      historyMessages: [
        {
          role: "User",
          content: "Hello",
        },
        {
          role: "Assistant",
          content: "Hi there!",
        },
      ],
      model: "gpt-4",
      totalPromptTokens: 10,
      totalCompletionTokens: 5,
      maxOutputTokens: 4000,
      isWebSearchMode: false,
    };

    it("should fetch chat messages with default page parameter", async () => {
      // Arrange
      const chatId = "test-chat-id";
      apiClientMock.get.mockResolvedValue(mockChatMessagesRes);

      // Act
      const result = await getChatMessagesService(chatId);

      // Assert
      expect(apiClientMock.get).toHaveBeenCalledWith(
        `/chat/${chatId}/messages?page=0`
      );
      expect(result).toEqual(mockChatMessagesRes);
    });

    it("should fetch chat messages with custom page parameter", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const page = 2;
      apiClientMock.get.mockResolvedValue(mockChatMessagesRes);

      // Act
      const result = await getChatMessagesService(chatId, page);

      // Assert
      expect(apiClientMock.get).toHaveBeenCalledWith(
        `/chat/${chatId}/messages?page=${page}`
      );
      expect(result).toEqual(mockChatMessagesRes);
    });

    it("should handle API errors gracefully", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const error = new Error("Network error");
      apiClientMock.get.mockRejectedValue(error);

      // Act & Assert
      await expect(getChatMessagesService(chatId)).rejects.toThrow(
        "Network error"
      );
      expect(apiClientMock.get).toHaveBeenCalledWith(
        `/chat/${chatId}/messages?page=0`
      );
    });

    it("should work with edge case chat ID", async () => {
      // Arrange
      const chatId = "special-chars-123_test";
      apiClientMock.get.mockResolvedValue(mockChatMessagesRes);

      // Act
      await getChatMessagesService(chatId, 1);

      // Assert
      expect(apiClientMock.get).toHaveBeenCalledWith(
        `/chat/${chatId}/messages?page=1`
      );
    });
  });

  describe("sendNewMessageService", () => {
    const mockNewMessageRes: NewMessageRes = {
      chatId: "new-chat-id",
      isNew: true,
    };

    it("should send new message with FormData", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("message", "Hello world");
      formData.append("chatId", "test-chat-id");
      apiClientMock.postFormData.mockResolvedValue(mockNewMessageRes);

      // Act
      const result = await sendNewMessageService(formData);

      // Assert
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/chat/send-user-message",
        formData
      );
      expect(result).toEqual(mockNewMessageRes);
    });

    it("should handle API errors when sending message", async () => {
      // Arrange
      const formData = new FormData();
      formData.append("message", "Test message");
      const error = new Error("Failed to send message");
      apiClientMock.postFormData.mockRejectedValue(error);

      // Act & Assert
      await expect(sendNewMessageService(formData)).rejects.toThrow(
        "Failed to send message"
      );
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/chat/send-user-message",
        formData
      );
    });

    it("should send message with file attachment", async () => {
      // Arrange
      const formData = new FormData();
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      formData.append("message", "Check this file");
      formData.append("file", mockFile);
      apiClientMock.postFormData.mockResolvedValue(mockNewMessageRes);

      // Act
      const result = await sendNewMessageService(formData);

      // Assert
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/chat/send-user-message",
        formData
      );
      expect(result).toEqual(mockNewMessageRes);
    });
  });

  describe("streamAssistantMessageService", () => {
    it("should stream assistant message with callback", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const onChunkMock = vi.fn();
      const signal = new AbortController().signal;

      apiClientMock.getStream.mockResolvedValue(undefined);

      // Act
      await streamAssistantMessageService(chatId, onChunkMock, signal);

      // Assert
      expect(apiClientMock.getStream).toHaveBeenCalledWith(
        `/chat/assistant-message/${chatId}`,
        onChunkMock,
        signal
      );
    });

    it("should stream assistant message without abort signal", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const onChunkMock = vi.fn();

      apiClientMock.getStream.mockResolvedValue(undefined);

      // Act
      await streamAssistantMessageService(chatId, onChunkMock);

      // Assert
      expect(apiClientMock.getStream).toHaveBeenCalledWith(
        `/chat/assistant-message/${chatId}`,
        onChunkMock,
        undefined
      );
    });

    it("should handle streaming errors", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const onChunkMock = vi.fn();
      const error = new Error("Stream connection failed");
      apiClientMock.getStream.mockRejectedValue(error);

      // Act & Assert
      await expect(
        streamAssistantMessageService(chatId, onChunkMock)
      ).rejects.toThrow("Stream connection failed");
      expect(apiClientMock.getStream).toHaveBeenCalledWith(
        `/chat/assistant-message/${chatId}`,
        onChunkMock,
        undefined
      );
    });

    it("should properly call onChunk callback with assistant chunk data", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const onChunkMock = vi.fn();
      const mockChunk: AssistantChunkRes = {
        content: "Hello",
        isLastChunk: false,
      };

      // Mock the getStream to simulate calling onChunk
      apiClientMock.getStream.mockImplementation(
        async (_path, onChunk) => {
          onChunk(mockChunk);
        }
      );

      // Act
      await streamAssistantMessageService(chatId, onChunkMock);

      // Assert
      expect(onChunkMock).toHaveBeenCalledWith(mockChunk);
    });
  });

  describe("toggleWebSearchModeService", () => {
    it("should toggle web search mode to true", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const isWebSearchMode = true;
      apiClientMock.patch.mockResolvedValue({});

      // Act
      const result = await toggleWebSearchModeService(chatId, isWebSearchMode);

      // Assert
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/toggle-web-search-mode`,
        { isWebSearchMode }
      );
      expect(result).toEqual({});
    });

    it("should toggle web search mode to false", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const isWebSearchMode = false;
      apiClientMock.patch.mockResolvedValue({});

      // Act
      const result = await toggleWebSearchModeService(chatId, isWebSearchMode);

      // Assert
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/toggle-web-search-mode`,
        { isWebSearchMode }
      );
      expect(result).toEqual({});
    });

    it("should handle API errors when toggling web search mode", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const isWebSearchMode = true;
      const error = new Error("Failed to toggle web search mode");
      apiClientMock.patch.mockRejectedValue(error);

      // Act & Assert
      await expect(
        toggleWebSearchModeService(chatId, isWebSearchMode)
      ).rejects.toThrow("Failed to toggle web search mode");
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/toggle-web-search-mode`,
        { isWebSearchMode }
      );
    });
  });

  describe("changeMaxOutputTokensService", () => {
    const mockResponse = { maxOutputTokens: 2000 };

    it("should change max output tokens", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const maxOutputTokens = 2000;
      apiClientMock.patch.mockResolvedValue(mockResponse);

      // Act
      const result = await changeMaxOutputTokensService(chatId, maxOutputTokens);

      // Assert
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/change-max-output-tokens`,
        { maxOutputTokens }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle edge case values for max output tokens", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const maxOutputTokens = 1; // Minimum value
      const mockMinResponse = { maxOutputTokens: 1 };
      apiClientMock.patch.mockResolvedValue(mockMinResponse);

      // Act
      const result = await changeMaxOutputTokensService(chatId, maxOutputTokens);

      // Assert
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/change-max-output-tokens`,
        { maxOutputTokens }
      );
      expect(result).toEqual(mockMinResponse);
    });

    it("should handle large values for max output tokens", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const maxOutputTokens = 8000; // Large value
      const mockLargeResponse = { maxOutputTokens: 8000 };
      apiClientMock.patch.mockResolvedValue(mockLargeResponse);

      // Act
      const result = await changeMaxOutputTokensService(chatId, maxOutputTokens);

      // Assert
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/change-max-output-tokens`,
        { maxOutputTokens }
      );
      expect(result).toEqual(mockLargeResponse);
    });

    it("should handle API errors when changing max output tokens", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const maxOutputTokens = 4000;
      const error = new Error("Failed to change max output tokens");
      apiClientMock.patch.mockRejectedValue(error);

      // Act & Assert
      await expect(
        changeMaxOutputTokensService(chatId, maxOutputTokens)
      ).rejects.toThrow("Failed to change max output tokens");
      expect(apiClientMock.patch).toHaveBeenCalledWith(
        `/chat/${chatId}/change-max-output-tokens`,
        { maxOutputTokens }
      );
    });
  });

  describe("deleteChatService", () => {
    const mockDeleteResponse = { message: "Chat deleted successfully" };

    it("should delete chat successfully", async () => {
      // Arrange
      const chatId = "test-chat-id";
      apiClientMock.del.mockResolvedValue(mockDeleteResponse);

      // Act
      const result = await deleteChatService(chatId);

      // Assert
      expect(apiClientMock.del).toHaveBeenCalledWith(`/chat/${chatId}/delete`);
      expect(result).toEqual(mockDeleteResponse);
    });

    it("should handle API errors when deleting chat", async () => {
      // Arrange
      const chatId = "test-chat-id";
      const error = new Error("Failed to delete chat");
      apiClientMock.del.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteChatService(chatId)).rejects.toThrow(
        "Failed to delete chat"
      );
      expect(apiClientMock.del).toHaveBeenCalledWith(`/chat/${chatId}/delete`);
    });

    it("should handle deletion of non-existent chat", async () => {
      // Arrange
      const chatId = "non-existent-chat-id";
      const error = new Error("Chat not found");
      apiClientMock.del.mockRejectedValue(error);

      // Act & Assert
      await expect(deleteChatService(chatId)).rejects.toThrow("Chat not found");
      expect(apiClientMock.del).toHaveBeenCalledWith(`/chat/${chatId}/delete`);
    });
  });

  describe("transcribeAudioService", () => {
    const mockTranscribedRes: TranscribedRes = {
      content: "Hello, this is a transcribed message.",
    };

    it("should transcribe audio blob successfully", async () => {
      // Arrange
      const audioContent = new Uint8Array([1, 2, 3, 4]);
      const audioBlob = new Blob([audioContent], { type: "audio/wav" });
      apiClientMock.postFormData.mockResolvedValue(mockTranscribedRes);

      // Act
      const result = await transcribeAudioService(audioBlob);

      // Assert
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/audio/transcribe",
        expect.any(FormData)
      );
      expect(result).toEqual(mockTranscribedRes);

      // Verify FormData contains the audio file
      const callArgs = apiClientMock.postFormData.mock.calls[0];
      const formData = callArgs[1] as FormData;
      const audioFile = formData.get("audio") as File;
      expect(audioFile).toBeInstanceOf(File);
      expect(audioFile.name).toBe("audio.wav");
      expect(audioFile.type).toBe("audio/wav");
    });

    it("should handle different audio blob types", async () => {
      // Arrange
      const audioContent = new Uint8Array([5, 6, 7, 8]);
      const audioBlob = new Blob([audioContent], { type: "audio/mp3" });
      apiClientMock.postFormData.mockResolvedValue(mockTranscribedRes);

      // Act
      const result = await transcribeAudioService(audioBlob);

      // Assert
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/audio/transcribe",
        expect.any(FormData)
      );
      expect(result).toEqual(mockTranscribedRes);

      // Verify FormData contains the audio file with correct type
      const callArgs = apiClientMock.postFormData.mock.calls[0];
      const formData = callArgs[1] as FormData;
      const audioFile = formData.get("audio") as File;
      expect(audioFile.type).toBe("audio/mp3");
    });

    it("should handle empty audio blob", async () => {
      // Arrange
      const audioBlob = new Blob([], { type: "audio/wav" });
      apiClientMock.postFormData.mockResolvedValue(mockTranscribedRes);

      // Act
      const result = await transcribeAudioService(audioBlob);

      // Assert
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/audio/transcribe",
        expect.any(FormData)
      );
      expect(result).toEqual(mockTranscribedRes);
    });

    it("should handle API errors during transcription", async () => {
      // Arrange
      const audioContent = new Uint8Array([1, 2, 3]);
      const audioBlob = new Blob([audioContent], { type: "audio/wav" });
      const error = new Error("Transcription service unavailable");
      apiClientMock.postFormData.mockRejectedValue(error);

      // Act & Assert
      await expect(transcribeAudioService(audioBlob)).rejects.toThrow(
        "Transcription service unavailable"
      );
      expect(apiClientMock.postFormData).toHaveBeenCalledWith(
        "/audio/transcribe",
        expect.any(FormData)
      );
    });

    it("should create audio file with correct properties", async () => {
      // Arrange
      const audioContent = new Uint8Array([10, 20, 30]);
      const audioBlob = new Blob([audioContent], { type: "audio/webm" });
      apiClientMock.postFormData.mockResolvedValue(mockTranscribedRes);

      // Act
      await transcribeAudioService(audioBlob);

      // Assert
      const callArgs = apiClientMock.postFormData.mock.calls[0];
      const formData = callArgs[1] as FormData;
      const audioFile = formData.get("audio") as File;
      
      expect(audioFile.name).toBe("audio.wav");
      expect(audioFile.type).toBe("audio/webm"); // Should preserve original blob type
      expect(audioFile.size).toBe(audioContent.length);
    });
  });

  describe("Error handling across all services", () => {
    it("should propagate network errors consistently", async () => {
      // Arrange
      const networkError = new Error("Network timeout");
      apiClientMock.get.mockRejectedValue(networkError);
      apiClientMock.patch.mockRejectedValue(networkError);
      apiClientMock.del.mockRejectedValue(networkError);

      // Act & Assert
      await expect(getChatMessagesService("test-id")).rejects.toThrow(
        "Network timeout"
      );
      await expect(
        toggleWebSearchModeService("test-id", true)
      ).rejects.toThrow("Network timeout");
      await expect(deleteChatService("test-id")).rejects.toThrow(
        "Network timeout"
      );
    });

    it("should handle authorization errors consistently", async () => {
      // Arrange
      const authError = new Error("Unauthorized");
      apiClientMock.get.mockRejectedValue(authError);
      apiClientMock.postFormData.mockRejectedValue(authError);
      apiClientMock.getStream.mockRejectedValue(authError);

      // Act & Assert
      await expect(getChatMessagesService("test-id")).rejects.toThrow(
        "Unauthorized"
      );
      await expect(
        sendNewMessageService(new FormData())
      ).rejects.toThrow("Unauthorized");
      await expect(
        streamAssistantMessageService("test-id", vi.fn())
      ).rejects.toThrow("Unauthorized");
    });
  });
});
