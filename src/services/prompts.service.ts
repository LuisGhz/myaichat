import { apiClient } from "api";
import { GetAllPromptsRes } from "types/prompts/GetAllPromptsRes.type";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { NewPromptRes } from "types/prompts/NewPromptRes.type";

export const getPromptsService = () => {
  return apiClient.get<GetAllPromptsRes>("/custom-prompts/all");
}

export const createPromptService = (req: NewPromptReq) => {
  return apiClient.post<NewPromptRes, NewPromptReq>("/custom-prompts", req);
}