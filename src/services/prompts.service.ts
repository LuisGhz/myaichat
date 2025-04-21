import { apiClient } from "api";
import { CustomPrompt } from "types/prompts/CustomPrompt.type";
import { GetAllPromptsRes } from "types/prompts/GetAllPromptsRes.type";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { NewPromptRes } from "types/prompts/NewPromptRes.type";
import { UpdatedPromptRes } from "types/prompts/UpdatedPromptRes.type";
import { UpdatePromptReq } from "types/prompts/UpdatePromptReq.type";

export const getPromptsService = () => {
  return apiClient.get<GetAllPromptsRes>("/custom-prompts/all");
}

export const getPromptByIdService = (id: string) => {
  return apiClient.get<CustomPrompt>(`/custom-prompts/${id}`);
}

export const createPromptService = (req: NewPromptReq) => {
  return apiClient.post<NewPromptRes, NewPromptReq>("/custom-prompts", req);
}

export const updatePromptService = (req: UpdatePromptReq) => {
  const { id, ...rest } = req;
  return apiClient.patch<UpdatedPromptRes, unknown>(`/custom-prompts/${id}/update`, rest);
}

export const deletePromptParamService = (promptId: string, paramId: string) => {
  return apiClient.del(`/custom-prompts/${promptId}/${paramId}/delete-param`);
}