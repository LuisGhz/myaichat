type ChatStore = {
  model: ModelsValues;
  setModel: (model: ModelsValues) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  promptId?: string | undefined;
  setPromptId: (id: string | undefined) => void;
  currentChatMetadata?: Omit<ChatMessagesRes, "historyMessages"> | undefined;
  setCurrentChatMetadata: (
    metadata: Omit<ChatMessagesRes, "historyMessages"> | undefined
  ) => void;
};
