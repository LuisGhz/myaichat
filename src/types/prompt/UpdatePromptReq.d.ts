type UpdatePromptReq = {
  id: string;
  name: string;
  content: string;
  messages?: PromptMessages[];
};