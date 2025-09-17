type ChatMessage = {
  role: MessageRole;
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  file?: File | string;
};
