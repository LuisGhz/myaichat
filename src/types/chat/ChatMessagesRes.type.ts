import { Message } from "./Message.type"

export type ChatMessagesRes = {
  historyMessages: Message[];
  model: string;
}