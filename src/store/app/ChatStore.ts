import { useChatZustandStore } from "store/ChatZustandStore";

export const useChatStore = () => {
  const model = useChatZustandStore((state) => state.model);
  const maxTokens = useChatZustandStore((state) => state.maxTokens);
  const promptId = useChatZustandStore((state) => state.promptId);
  const currentChatMetadata = useChatZustandStore(
    (state) => state.currentChatMetadata
  );
  const messages = useChatZustandStore((state) => state.messages);
  return { model, maxTokens, promptId, currentChatMetadata, messages };
};

export const useChatStoreActions = () => {
  const setModel = useChatZustandStore((state) => state.setModel);
  const setMaxTokens = useChatZustandStore((state) => state.setMaxTokens);
  const setPromptId = useChatZustandStore((state) => state.setPromptId);
  const setCurrentChatMetadata = useChatZustandStore(
    (state) => state.setCurrentChatMetadata
  );
  const setMessages = useChatZustandStore((state) => state.setMessages);
  return {
    setModel,
    setMaxTokens,
    setPromptId,
    setCurrentChatMetadata,
    setMessages,
  };
};
