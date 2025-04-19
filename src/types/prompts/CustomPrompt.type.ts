import { PromptMessages } from "./PromptMessages.type";
import { PromptParams } from "./PromptParams.type";

export type CustomPrompt = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  messages?: PromptMessages[];
  params?: PromptParams[];
};