export type NewMessageRes = {
  chatId?: string;
  content: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};
