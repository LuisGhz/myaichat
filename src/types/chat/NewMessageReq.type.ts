import { Models } from "./Models.type";

export type NewMessageReq = {
  chatId?: string;
  prompt: string;
  model?: Models;
  image? : File;
  promptId?: string;
}