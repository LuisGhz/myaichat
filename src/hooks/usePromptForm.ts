import { PromptForm } from "components/Prompts/PromptSchema";
import {
  createPromptService,
  updatePromptService,
} from "services/prompts.service";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { useToast } from "./useToast";
import { UpdatePromptReq } from "types/prompts/UpdatePromptReq.type";

export const usePromptForm = () => {
  const { toastSuccess, toastError } = useToast();

  const onPromptFormSubmit = async (data: PromptForm) => {
    const req: NewPromptReq = {
      name: data.name,
      content: data.content,
      messages: data.messages?.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      params: data.params?.map((param) => ({
        id: cleanDefaultsIds(param.id),
        name: param.name,
        value: param.value,
      })),
    };

    try {
      const res = await createPromptService(req);
      toastSuccess("Prompt created successfully!");
      return res;
    } catch (error) {
      toastError(`${error}`);
    }
  };

  const onPromptUpdateFormSubmit = async (id: string, data: PromptForm) => {
    const req: UpdatePromptReq = {
      id,
      name: data.name,
      content: data.content,
      messages: data.messages?.map((message) => ({
        id: cleanDefaultsIds(message.id),
        role: message.role,
        content: message.content,
      })),
      params: data.params?.map((param) => ({
        id: cleanDefaultsIds(param.id),
        name: param.name,
        value: param.value,
      })),
    };

    try {
      toastSuccess("Prompt updated successfully!");
      return await updatePromptService(req);
    } catch (error) {
      toastError(`${error}`);
    }
  };

  const cleanDefaultsIds = (id: string) => {
    if (id.includes("default")) return "";
    return id;
  };

  return { onPromptFormSubmit, onPromptUpdateFormSubmit };
};
