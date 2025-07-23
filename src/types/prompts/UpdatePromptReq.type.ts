import { PromptMessages } from "./PromptMessages.type";

export type UpdatePromptReq = {
  id: string;
  name: string;
  content: string;
  messages?: PromptMessages[];
};