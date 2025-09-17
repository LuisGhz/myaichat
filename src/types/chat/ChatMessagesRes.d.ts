type ChatMessagesRes = {
  historyMessages: ChatMessage[];
  model: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  maxOutputTokens: number;
  isWebSearchMode: boolean;
};
