type NewPromptRes = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  messages?: PromptMessages[];
};
