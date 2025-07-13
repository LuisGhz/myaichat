import { ModelsValues } from "./ModelsValues.type";

export type NewMessageReq = {
  chatId?: string;
  prompt: string;
  model?: ModelsValues;
  file? : File;
  promptId?: string;
  maxOutputTokens: number;
  isWebSearchMode: boolean;
}