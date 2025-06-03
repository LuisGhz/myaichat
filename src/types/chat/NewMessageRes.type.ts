export type NewMessageRes = {
  chatId?: string;
  chatTitle?: string;
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  totalChatPromptTokens: number;
  totalChatCompletionTokens: number;
};
