type SendNewMessageReq = {
  chatId?: string;
  content: string;
  model?: ModelsValues;
  file?: File;
  promptId?: string;
  maxOutputTokens: number;
  isWebSearchMode: boolean;
};
