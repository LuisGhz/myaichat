type AssistantChunkRes = {
  content: string;
  isLastChunk: boolean;

  // Properties only present in the last chunk
  chatId?: string; // UUID as string
  chatTitle?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  totalChatPromptTokens?: number;
  totalChatCompletionTokens?: number;
};
