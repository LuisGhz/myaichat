import { PromptMessages } from "./PromptMessages.type";
import { PromptParams } from "./PromptParams.type";

export type NewPromptReq = {
  name: string;
  content: string;
  messages?: PromptMessages[];
  params?: PromptParams[];
}