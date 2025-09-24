import { PromptForm } from "../schemas/PromptSchema";
import {
  createPromptService,
  updatePromptService,
} from "../services/PromptsService";

export const usePromptForm = () => {
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
      return res;
    } catch (error) {
      console.error(error);
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
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  const cleanDefaultsIds = (id: string) => {
    if (id.includes("default")) return "";
    return id;
  };

  return { onPromptFormSubmit, onPromptUpdateFormSubmit };
};
