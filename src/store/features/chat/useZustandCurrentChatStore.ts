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
  isRecordingAudio: boolean;
  isSendingAudio: boolean;
  setCurrentModelData: (data: ModelData | null) => void;
  setMaxOutputTokens: (maxOutputTokens: number) => void;
  setIsWebSearchMode: (isWebSearchMode: boolean) => void;
  setIsRecordingAudio: (isRecording: boolean) => void;
  setIsSendingAudio: (isSending: boolean) => void;
}

export const useZustandCurrentChatStore = create<CurrentChatState>((set) => ({
  currentModelData: null,
  defaultMaxOutputTokens: 2000,
  maxOutputTokens: 2000,
  isWebSearchMode: false,
  isRecordingAudio: false,
  isSendingAudio: false,
  setCurrentModelData: (data) => set({ currentModelData: data }),
  setMaxOutputTokens: (maxOutputTokens) => set({ maxOutputTokens }),
  setIsWebSearchMode: (isWebSearchMode) => set({ isWebSearchMode }),
  setIsRecordingAudio: (isRecording) => set({ isRecordingAudio: isRecording }),
  setIsSendingAudio: (isSending) => set({ isSendingAudio: isSending }),
}));
