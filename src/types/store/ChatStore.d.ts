type ChatStore = {
  model: ModelsValues;
  setModel: (model: ModelsValues) => void;
  maxOutputTokens: number;
  setMaxOutputTokens: (tokens: number) => void;
  isWebSearchMode: boolean;
  setIsWebSearchMode: (isWebSearchMode: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addStreamingAssistantMessage: () => void;
  updateStreamingAssistantMessage: (content: string) => void;
  promptId?: string | undefined;
  setPromptId: (id: string | undefined) => void;
  currentChatMetadata?: Omit<ChatMessagesRes, "historyMessages"> | undefined;
  setCurrentChatMetadata: (
    metadata: Omit<ChatMessagesRes, "historyMessages"> | undefined
  ) => void;
};
