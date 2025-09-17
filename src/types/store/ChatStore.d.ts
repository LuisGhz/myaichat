type ChatStore = {
  model: ModelsValues;
  setModel: (model: ModelsValues) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  promptId?: string;
  setPromptId: (id: string) => void;
};
