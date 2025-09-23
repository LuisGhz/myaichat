type ChatStore = {
  model: ModelsValues;
  setModel: (model: ModelsValues) => void;
  maxOutputTokens: number;
  setMaxOutputTokens: (tokens: number) => void;
  isWebSearchMode: boolean;
  setIsWebSearchMode: (isWebSearchMode: boolean) => void;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  addStreamingAssistantMessage: () => void;
  updateStreamingAssistantMessage: (content: string) => void;
  addStreamingAssistanteAndUserMessageTokens: (promptTokens: number, completionTokens: number) => void;
  promptId?: string | undefined;
  setPromptId: (id: string | undefined) => void;
  currentChatMetadata?: CurrentChatMetadataStore;
  setCurrentChatMetadata: (
    metadata: Partial<CurrentChatMetadataStore>
  ) => void;
  isRecordingAudio: boolean;
  setIsRecordingAudio: (isRecording: boolean) => void;
  isSendingAudio: boolean;
  setIsSendingAudio: (isSending: boolean) => void;
};
