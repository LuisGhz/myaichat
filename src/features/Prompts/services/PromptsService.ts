import { apiClient } from "api";

export const GetAllPromptsService = async () => {
  return await apiClient.get<GetAllPromptsRes>("/custom-prompts/all");
};
