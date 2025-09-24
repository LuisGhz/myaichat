import { useState, useCallback } from "react";
import {
  deletePromptMessageService,
  deletePromptService,
  GetAllPromptsService,
  getPromptByIdService,
} from "../services/PromptsService";

export const usePrompts = () => {
  const [promptsSummary, setPromptsSummary] = useState<PromptSummary[]>([]);

  const getAllPrompts = useCallback(async () => {
    const response = await GetAllPromptsService();
    if (!response) return;
    setPromptsSummary(response.prompts);
  }, []);

  const getPromptById = useCallback(async (id: string) => {
    try {
      const prompt = await getPromptByIdService(id);
      return prompt;
    } catch (error) {
      console.error("Failed to fetch prompt by ID:", error);
      throw error; // Re-throw the error so calling code can handle it
    }
  }, []);

  const deletePromptMessage = useCallback(async (promptId: string, messageId: string) => {
    try {
      await deletePromptMessageService(promptId, messageId);
    } catch {
      console.error("Failed to delete prompt message. Please try again later.");
    }
  }, []);

  const deletePrompt = useCallback(async (promptId: string) => {
    setPromptsSummary((prev) => prev.filter((p) => p.id !== promptId));
    try {
      await deletePromptService(promptId);
    } catch (error) {
      setPromptsSummary(promptsSummary);
      console.error("Error deleting prompt:", error);
    }
  }, [promptsSummary]);

  return {
    getAllPrompts,
    promptsSummary,
    deletePrompt,
    deletePromptMessage,
    getPromptById,
  };
};
