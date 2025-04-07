export type Message = {
  role: string;
  content: string;
  promptTokens?: number;
  completionTokens?: number;
}