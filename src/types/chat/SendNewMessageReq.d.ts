type SendNewMessageReq = {
  chatId?: string;
  content: string;
  model?: ModelsValues;
  file: File | null;
  promptId?: string;
  maxOutputTokens: number;
  isWebSearchMode: boolean;
};
