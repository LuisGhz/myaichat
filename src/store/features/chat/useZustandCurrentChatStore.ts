import { create } from "zustand";

type ModelData = {
  model: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
};

interface CurrentChatState {
  currentModelData: ModelData | null;
  defaultMaxOutputTokens: number;
  maxOutputTokens: number;
  isWebSearchMode: boolean;
  isSendingMessage: boolean;
  isRecordingAudio: boolean;
  isSendingAudio: boolean;
  setCurrentModelData: (data: ModelData | null) => void;
  setMaxOutputTokens: (maxOutputTokens: number) => void;
  setIsWebSearchMode: (isWebSearchMode: boolean) => void;
  setIsSendingMessage: (isSending: boolean) => void;
  setIsRecordingAudio: (isRecording: boolean) => void;
  setIsSendingAudio: (isSending: boolean) => void;
}

const defaultMaxTokens = 2000;

export const useZustandCurrentChatStore = create<CurrentChatState>((set) => ({
  currentModelData: null,
  defaultMaxOutputTokens: defaultMaxTokens,
  maxOutputTokens: defaultMaxTokens,
  isWebSearchMode: false,
  isSendingMessage: false,
  isRecordingAudio: false,
  isSendingAudio: false,
  setCurrentModelData: (data) => set({ currentModelData: data }),
  setMaxOutputTokens: (maxOutputTokens) => set({ maxOutputTokens }),
  setIsWebSearchMode: (isWebSearchMode) => set({ isWebSearchMode }),
  setIsSendingMessage: (isSending) => set({ isSendingMessage: isSending }),
  setIsRecordingAudio: (isRecording) => set({ isRecordingAudio: isRecording }),
  setIsSendingAudio: (isSending) => set({ isSendingAudio: isSending }),
}));
