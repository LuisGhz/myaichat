import { useState, useCallback } from "react";
import {
  deletePromptMessageService,
  deletePromptService,
  GetAllPromptsService,
  getPromptByIdService,
} from "../services/PromptsService";
import { useAppMessage } from "shared/hooks/useAppMessage";

export const usePrompts = () => {
  const [promptsSummary, setPromptsSummary] = useState<PromptSummary[]>([]);
  const { errorMessage } = useAppMessage();
  const getAllPrompts = useCallback(async () => {
    try {
      const response = await GetAllPromptsService();
      if (!response) return;
      setPromptsSummary(response.prompts);
    } catch (error) {
      errorMessage("Failed to fetch prompts. Please try again later.");
      console.error("Failed to fetch prompts:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPromptById = useCallback(async (id: string) => {
    try {
      const prompt = await getPromptByIdService(id);
      return prompt;
    } catch (error) {
      console.error("Failed to fetch prompt by ID:", error);
      errorMessage("Failed to fetch prompt. Please try again later.");
      throw error; // Re-throw the error so calling code can handle it
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deletePromptMessage = useCallback(
    async (promptId: string, messageId: string) => {
      try {
        await deletePromptMessageService(promptId, messageId);
      } catch {
        console.error(
          "Failed to delete prompt message. Please try again later."
        );
        errorMessage(
          "Failed to delete prompt message. Please try again later."
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const deletePrompt = useCallback(
    async (promptId: string) => {
      setPromptsSummary((prev) => prev.filter((p) => p.id !== promptId));
      try {
        await deletePromptService(promptId);
      } catch (error) {
        errorMessage("Failed to delete prompt. Please try again later.");
        setPromptsSummary(promptsSummary);
        console.error("Error deleting prompt:", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [promptsSummary]
  );

  return {
    getAllPrompts,
    promptsSummary,
    deletePrompt,
    deletePromptMessage,
    getPromptById,
  };
};
