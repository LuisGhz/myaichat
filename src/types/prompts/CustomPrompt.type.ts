import { PromptMessages } from "./PromptMessages.type";

export type CustomPrompt = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  messages?: PromptMessages[];
};