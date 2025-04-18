import { apiClient } from "api";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";

export const createPromptService = (req: NewPromptReq) => {
  return apiClient.post("/custom-prompts", req);
}