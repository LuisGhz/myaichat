import { PromptForm } from "components/Prompts/PromptSchema";
import { createPromptService } from "services/prompts.service";
import { NewPromptReq } from "types/prompts/NewPromptReq.type";
import { useToast } from "./useToast";

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
        name: param.name,
        defaultValue: param.defaultValue,
      })),
    };

    try {
      toastSuccess("Prompt created successfully!");
      return await createPromptService(req);
    } catch (error) {
      toastError(`${error}`);
    }
  };

  return { onPromptFormSubmit };
};
