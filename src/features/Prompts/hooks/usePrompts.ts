import { useState } from "react";
import {
  deletePromptService,
  GetAllPromptsService,
} from "../services/PromptsService";

export const usePrompts = () => {
  const [promptsSummary, setPromptsSummary] = useState<PromptSummary[]>([]);

  const getAllPrompts = async () => {
    const response = await GetAllPromptsService();
    if (!response) return;
    setPromptsSummary(response.prompts);
  };

  const deletePrompt = async (promptId: string) => {
    setPromptsSummary((prev) => prev.filter((p) => p.id !== promptId));
    try {
      await deletePromptService(promptId);
    } catch (error) {
      setPromptsSummary(promptsSummary);
      console.error("Error deleting prompt:", error);
    }
  };

  return { getAllPrompts, promptsSummary, deletePrompt };
};
