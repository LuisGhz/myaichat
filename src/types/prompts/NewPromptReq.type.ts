import { PromptMessages } from "./PromptMessages.type";

export type NewPromptReq = {
  name: string;
  content: string;
  messages?: PromptMessages[];
}