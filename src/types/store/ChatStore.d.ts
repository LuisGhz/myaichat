type ChatStore = {
  model: ModelsValues;
  setModel: (model: ModelsValues) => void;
  maxOutputTokens: number;
  setMaxOutputTokens: (tokens: number) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  promptId?: string | undefined;
  setPromptId: (id: string | undefined) => void;
  currentChatMetadata?: Omit<ChatMessagesRes, "historyMessages"> | undefined;
  setCurrentChatMetadata: (
    metadata: Omit<ChatMessagesRes, "historyMessages"> | undefined
  ) => void;
};
