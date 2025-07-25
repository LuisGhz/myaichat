import { PromptForm } from "features/Prompts/PromptSchema";
import {
  createPromptService,
  updatePromptService,
} from "services/prompts.service";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { useToast } from "../../useToast";
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
    };

    try {
      const res = await updatePromptService(req);
      toastSuccess("Prompt updated successfully!");
      return res;
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
