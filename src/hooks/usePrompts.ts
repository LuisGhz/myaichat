import { useState } from "react";
import { useToast } from "./useToast";
import {
  deletePromptMessageService,
  deletePromptParamService,
  getPromptByIdService,
  getPromptsService,
} from "services/prompts.service";
import { GetAllPromptsRes } from "types/prompts/GetAllPromptsRes.type";

export const usePrompts = () => {
  const { toastError } = useToast();
  const [prompts, setPrompts] = useState<GetAllPromptsRes | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const getPrompts = async () => {
    try {
      const res = await getPromptsService();
      setPrompts(res);
    } catch {
      toastError("Failed to fetch prompts. Please try again later.");
    }
  };

  const getPromptById = async (id: string) => {
    try {
      setLoading(true);
      const prompt = await getPromptByIdService(id);
      return prompt;
    } catch {
      toastError("Failed to fetch prompt. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deletePromptParam = async (promptId: string, paramId: string) => {
    try {
      setLoading(true);
      await deletePromptParamService(promptId, paramId);
    } catch {
      toastError("Failed to delete prompt parameter. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const deletePromptMessage = async (promptId: string, messageId: string) => {
    try {
      setLoading(true);
      await deletePromptMessageService(promptId, messageId);
    } catch {
      toastError("Failed to delete prompt message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return {
    prompts,
    loading,
    getPromptById,
    deletePromptParam,
    deletePromptMessage,
    getPrompts,
  };
};
