import { DEFAULT_MODEL } from "core/const/Models";
import { create } from "zustand";

export const useChatZustandStore = create<ChatStore>((set) => ({
  model: DEFAULT_MODEL,
  setModel: (model: ModelsValues) => set({ model }),
  maxTokens: 2000,
  setMaxTokens: (tokens: number) => set({ maxTokens: tokens }),
  messages: [],
  setMessages: (messages: ChatMessage[]) => set({ messages }),
  promptId: undefined,
  setPromptId: (id: string | undefined) => set({ promptId: id }),
  currentChatMetadata: undefined,
  setCurrentChatMetadata: (
    metadata: Omit<ChatMessagesRes, "historyMessages"> | undefined
  ) => set({ currentChatMetadata: metadata }),
}));
