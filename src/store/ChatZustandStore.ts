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
  selectedFile: null,
  setSelectedFile: (file: File | null) => set({ selectedFile: file }),
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

      if (
        lastMessageIndex >= 0 &&
        messages[lastMessageIndex].role === "Assistant"
      ) {
        messages[lastMessageIndex] = {
          ...messages[lastMessageIndex],
          content,
        };
      }

      return { messages };
    }),
  addStreamingAssistanteAndUserMessageTokens: (
    promptTokens: number,
    completionTokens: number
  ) =>
    set((state) => {
      const messages = [...state.messages];
      const lastMessageIndex = messages.length - 1;
      const lastUserMessageIndex = messages.length - 2;

      if (
        lastMessageIndex >= 0 &&
        messages[lastMessageIndex].role === "Assistant"
      ) {
        messages[lastMessageIndex] = {
          ...messages[lastMessageIndex],
          completionTokens,
        };
      }

      if (
        lastUserMessageIndex >= 0 &&
        messages[lastUserMessageIndex].role === "User"
      ) {
        messages[lastUserMessageIndex] = {
          ...messages[lastUserMessageIndex],
          promptTokens,
        };
      }

      const { currentChatMetadata } = state;
      const newMetadata = {
        ...currentChatMetadata,
        totalPromptTokens:
          (currentChatMetadata?.totalPromptTokens || 0) + promptTokens,
        totalCompletionTokens:
          (currentChatMetadata?.totalCompletionTokens || 0) + completionTokens,
      };

      return {
        messages,
        currentChatMetadata: newMetadata as CurrentChatMetadataStore,
      };
    }),
  currentChatMetadata: undefined,
  setCurrentChatMetadata: (metadata: Partial<CurrentChatMetadataStore>) =>
    set((state) => {
      const newMetadata = {
        ...state.currentChatMetadata,
        ...(metadata as CurrentChatMetadataStore),
      };

      return {
        ...state,
        currentChatMetadata: newMetadata,
      };
    }),
  isRecordingAudio: false,
  setIsRecordingAudio: (isRecording: boolean) =>
    set({ isRecordingAudio: isRecording }),
  isSendingAudio: false,
  setIsSendingAudio: (isSending: boolean) => set({ isSendingAudio: isSending }),
}));
