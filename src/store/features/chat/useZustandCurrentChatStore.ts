import { create } from "zustand";

type ModelData = {
  model: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
};

interface CurrentChatState {
  currentModelData: ModelData | null;
  maxOutputTokens: number;
  setCurrentModelData: (data: ModelData | null) => void;
  setMaxOutputTokens: (maxOutputTokens: number) => void;
}

export const useZustandCurrentChatStore = create<CurrentChatState>((set) => ({
  currentModelData: null,
  maxOutputTokens: 2000,
  setCurrentModelData: (data) => set({ currentModelData: data }),
  setMaxOutputTokens: (maxOutputTokens) => set({ maxOutputTokens }),
}));
