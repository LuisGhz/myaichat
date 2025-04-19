import { getPromptsService } from "services/prompts.service";
import { useToast } from "./useToast";
import { useEffect, useState } from "react";
import { GetAllPromptsRes } from "types/prompts/GetAllPromptsRes.type";

export const usePrompts = () => {
  const { toastError } = useToast();
  const [prompts, setPrompts] = useState<GetAllPromptsRes | undefined>(
    undefined
  );

  useEffect(() => {
    getPrompts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPrompts = async () => {
    try {
      const res = await getPromptsService();
      setPrompts(res);
    } catch {
      toastError("Failed to fetch prompts. Please try again later.");
    }
  };

  return { prompts };
};
