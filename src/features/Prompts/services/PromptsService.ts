import { apiClient } from "api";

export const GetAllPromptsService = async () => {
  return await apiClient.get<GetAllPromptsRes>("/custom-prompts/all");
};

export const getPromptByIdService = (id: string) => {
  return apiClient.get<CustomPrompt>(`/custom-prompts/${id}`);
};

export const createPromptService = (req: NewPromptReq) => {
  return apiClient.post<NewPromptRes>("/custom-prompts", req);
};

export const updatePromptService = (req: UpdatePromptReq) => {
  const { id, ...rest } = req;
  return apiClient.patch<UpdatedPromptRes>(
    `/custom-prompts/${id}/update`,
    rest
  );
};

export const deletePromptService = (promptId: string) => {
  return apiClient.del(`/custom-prompts/${promptId}/delete`);
};

export const deletePromptMessageService = (
  promptId: string,
  messageId: string
) => {
  return apiClient.del(
    `/custom-prompts/${promptId}/${messageId}/delete-message`
  );
};