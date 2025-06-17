import { create } from 'zustand';

type ModelData = {
  model: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
};

interface CurrentChatState {
  currentModelData: ModelData | null;
  setCurrentModelData: (data: ModelData | null) => void;
}

export const useZustandCurrentChatStore = create<CurrentChatState>((set) => ({
  currentModelData: null,
  setCurrentModelData: (data) => set({ currentModelData: data }),
}));