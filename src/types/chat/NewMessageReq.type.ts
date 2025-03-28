import { Models } from "./Models.type";

export type NewMessageReq = {
  chatId?: string;
  prompt: string;
  model?: Models;
}