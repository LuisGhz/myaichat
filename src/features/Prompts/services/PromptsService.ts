import { apiClient } from "api";

export const GetAllPromptsService = async () => {
  return await apiClient.get<GetAllPromptsRes>("/custom-prompts/all");
};

export const deletePromptService = (promptId: string) => {
  return apiClient.del(`/custom-prompts/${promptId}/delete`);
};
