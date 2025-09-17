import { useState } from "react";
import { GetAllPromptsService } from "../services/PromptsService";

export const usePrompts = () => {
  const [promptsSummary, setPromptsSummary] = useState<PromptSummary[]>([]);

  const getAllPrompts = async () => {
    const response = await GetAllPromptsService();
    if (!response) return;
    setPromptsSummary(response.prompts);
  };

  return { getAllPrompts, promptsSummary };
};
