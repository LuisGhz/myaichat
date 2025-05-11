export type Prompt = {
  id: string;
  name: string;
}

export type GetAllPromptsRes = {
  prompts: Prompt[];
}