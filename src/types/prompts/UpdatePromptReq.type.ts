import { PromptMessages } from "./PromptMessages.type";
import { PromptParams } from "./PromptParams.type";

export type UpdatePromptReq = {
  id: string;
  name: string;
  content: string;
  messages?: PromptMessages[];
  params?: PromptParams[];
};