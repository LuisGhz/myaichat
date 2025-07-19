import { authenticatedApiClient } from "api/auth.api";
import { CustomPrompt } from "types/prompts/CustomPrompt.type";
import { GetAllPromptsRes } from "types/prompts/GetAllPromptsRes.type";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { NewPromptRes } from "types/prompts/NewPromptRes.type";
import { UpdatedPromptRes } from "types/prompts/UpdatedPromptRes.type";
import { UpdatePromptReq } from "types/prompts/UpdatePromptReq.type";

export const getPromptsService = () => {
  return authenticatedApiClient.get<GetAllPromptsRes>("/custom-prompts/all");
};

export const getPromptByIdService = (id: string) => {
  return authenticatedApiClient.get<CustomPrompt>(`/custom-prompts/${id}`);
};

export const createPromptService = (req: NewPromptReq) => {
  return authenticatedApiClient.post<NewPromptRes>("/custom-prompts", req);
};

export const updatePromptService = (req: UpdatePromptReq) => {
  const { id, ...rest } = req;
  return authenticatedApiClient.patch<UpdatedPromptRes>(
    `/custom-prompts/${id}/update`,
    rest
  );
};

export const deletePromptService = (promptId: string) => {
  return authenticatedApiClient.del(`/custom-prompts/${promptId}/delete`);
};

export const deletePromptParamService = (promptId: string, paramId: string) => {
  return authenticatedApiClient.del(`/custom-prompts/${promptId}/${paramId}/delete-param`);
};

export const deletePromptMessageService = (
  promptId: string,
  messageId: string
) => {
  return authenticatedApiClient.del(
    `/custom-prompts/${promptId}/${messageId}/delete-message`
  );
};
