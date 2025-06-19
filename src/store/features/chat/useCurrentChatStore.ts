import { useZustandCurrentChatStore } from "./useZustandCurrentChatStore";

export const useCurrentChatStoreGetCurrentModelData = () =>
  useZustandCurrentChatStore((state) => state.currentModelData);
export const useCurrentChatStoreGetMaxOutputTokens = () =>
  useZustandCurrentChatStore((state) => state.maxOutputTokens);
export const useCurrentChatStoreGetDefaultMaxOutputTokens = () =>
  useZustandCurrentChatStore((state) => state.defaultMaxOutputTokens);
export const useCurrentChatStoreSetCurrentModelData = () =>
  useZustandCurrentChatStore((state) => state.setCurrentModelData);
export const useCurrentChatStoreSetMaxOutputTokens = () =>
  useZustandCurrentChatStore((state) => state.setMaxOutputTokens);
