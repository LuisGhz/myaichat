import { ModelsValues } from "./ModelsValues.type";

export type NewMessageReq = {
  chatId?: string;
  prompt: string;
  model?: ModelsValues;
  image? : File;
  promptId?: string;
}