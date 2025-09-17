type ChatStore = {
  model: ModelsValues;
  setModel: (model: ModelsValues) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  promptId?: string | undefined;
  setPromptId: (id: string | undefined) => void;
};
