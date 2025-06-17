import { useZustandCurrentChatStore } from "./useZustandCurrentChatStore";

export const useCurrentChatStoreGetCurrentModelData = () =>
  useZustandCurrentChatStore((state) => state.currentModelData);
export const useCurrentChatStoreSetCurrentModelData = () =>
  useZustandCurrentChatStore((state) => state.setCurrentModelData);
