import { DEFAULT_MODEL } from "core/const/Models";
import { create } from "zustand";

export const useChatZustandStore = create<ChatStore>((set) => ({
  model: DEFAULT_MODEL,
  setModel: (model: ModelsValues) => set({ model }),
  maxOutputTokens: 2000,
  setMaxOutputTokens: (tokens: number) => set({ maxOutputTokens: tokens }),
  isWebSearchMode: false,
  setIsWebSearchMode: (isWebSearchMode: boolean) =>
    set({ isWebSearchMode: isWebSearchMode }),
  promptId: undefined,
  setPromptId: (id: string | undefined) => set({ promptId: id }),
  messages: [],
  setMessages: (messages: ChatMessage[]) => set({ messages }),
  addStreamingAssistantMessage: () =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          role: "Assistant" as MessageRole,
          content: "",
        },
      ],
    })),
  updateStreamingAssistantMessage: (content: string) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessageIndex = messages.length - 1;
      
      if (lastMessageIndex >= 0 && messages[lastMessageIndex].role === "Assistant") {
        messages[lastMessageIndex] = {
          ...messages[lastMessageIndex],
          content,
        };
      }
      
      return { messages };
    }),
  currentChatMetadata: undefined,
  setCurrentChatMetadata: (
    metadata: Omit<ChatMessagesRes, "historyMessages"> | undefined
  ) => set({ currentChatMetadata: metadata }),
}));
