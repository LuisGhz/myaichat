import { PromptMessages } from "./PromptMessages.type";

export type NewPromptRes = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  messages?: PromptMessages[];
};
