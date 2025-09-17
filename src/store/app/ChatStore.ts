import { useChatZustandStore } from "store/ChatZustandStore";

export const useChatStore = () => {
  const model = useChatZustandStore((state) => state.model);
  const maxTokens = useChatZustandStore((state) => state.maxTokens);
  const promptId = useChatZustandStore((state) => state.promptId);
  return { model, maxTokens, promptId };
};

export const useChatStoreActions = () => {
  const setModel = useChatZustandStore((state) => state.setModel);
  const setMaxTokens = useChatZustandStore((state) => state.setMaxTokens);
  const setPromptId = useChatZustandStore((state) => state.setPromptId);
  return { setModel, setMaxTokens, setPromptId };
};
