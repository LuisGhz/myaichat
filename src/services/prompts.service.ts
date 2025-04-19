import { apiClient } from "api";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { NewPromptRes } from "types/prompts/NewPromptRes.type";

export const createPromptService = (req: NewPromptReq) => {
  return apiClient.post<NewPromptRes, NewPromptReq>("/custom-prompts", req);
}