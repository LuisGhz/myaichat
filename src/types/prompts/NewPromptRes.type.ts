import { PromptMessages } from "./PromptMessages.type";
import { PromptParams } from "./PromptParams.type";

export type NewPromptRes = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  messages?: PromptMessages[];
  params?: PromptParams[];
};
