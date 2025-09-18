import { useChatZustandStore } from "store/ChatZustandStore";

export const useChatStore = () => {
  const model = useChatZustandStore((state) => state.model);
  const maxOutputTokens = useChatZustandStore((state) => state.maxOutputTokens);
  const isWebSearchMode = useChatZustandStore((state) => state.isWebSearchMode);
  const promptId = useChatZustandStore((state) => state.promptId);
  const currentChatMetadata = useChatZustandStore(
    (state) => state.currentChatMetadata
  );
  const messages = useChatZustandStore((state) => state.messages);
  return {
    model,
    maxOutputTokens,
    isWebSearchMode,
    promptId,
    currentChatMetadata,
    messages,
  };
};

export const useChatStoreActions = () => {
  const setModel = useChatZustandStore((state) => state.setModel);
  const setMaxOutputTokens = useChatZustandStore(
    (state) => state.setMaxOutputTokens
  );
  const setIsWebSearchMode = useChatZustandStore(
    (state) => state.setIsWebSearchMode
  );
  const setPromptId = useChatZustandStore((state) => state.setPromptId);
  const setCurrentChatMetadata = useChatZustandStore(
    (state) => state.setCurrentChatMetadata
  );
  const setMessages = useChatZustandStore((state) => state.setMessages);
  const addStreamingAssistantMessage = useChatZustandStore(
    (state) => state.addStreamingAssistantMessage
  );
  const updateStreamingAssistantMessage = useChatZustandStore(
    (state) => state.updateStreamingAssistantMessage
  );

  const addStreamingAssistanteAndUserMessageTokens = useChatZustandStore(
    (state) => state.addStreamingAssistanteAndUserMessageTokens
  );
  
  return {
    setModel,
    setMaxOutputTokens,
    setPromptId,
    setCurrentChatMetadata,
    setMessages,
    setIsWebSearchMode,
    addStreamingAssistantMessage,
    updateStreamingAssistantMessage,
    addStreamingAssistanteAndUserMessageTokens,
  };
};
