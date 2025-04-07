type Role = "User" | "Assistant";

export type Message = {
  role: Role;
  content: string;
  promptTokens?: number;
  completionTokens?: number;
  image?: File | string;
}