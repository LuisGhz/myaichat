export const useCurrentChatStoreGetCurrentModelData = () =>
  useZustandCurrentChatStore((state) => state.currentModelData);
export const useCurrentChatStoreGetMaxOutputTokens = () =>
  useZustandCurrentChatStore((state) => state.maxOutputTokens);
export const useCurrentChatStoreGetDefaultMaxOutputTokens = () =>
  useZustandCurrentChatStore((state) => state.defaultMaxOutputTokens);
export const useCurrentChatStoreGetIsWebSearchMode = () =>
  useZustandCurrentChatStore((state) => state.isWebSearchMode);
export const useCurrentChatStoreGetIsSendingMessage = () =>
  useZustandCurrentChatStore((state) => state.isSendingMessage);
export const useCurrentChatStoreGetIsRecordingAudio = () =>
  useZustandCurrentChatStore((state) => state.isRecordingAudio);
export const useCurrentChatStoreGetIsSendingAudio = () =>
  useZustandCurrentChatStore((state) => state.isSendingAudio);
import { useZustandCurrentChatStore } from "./useZustandCurrentChatStore";
export const useCurrentChatStoreSetCurrentModelData = () =>
  useZustandCurrentChatStore((state) => state.setCurrentModelData);
export const useCurrentChatStoreSetMaxOutputTokens = () =>
  useZustandCurrentChatStore((state) => state.setMaxOutputTokens);
export const useCurrentChatStoreSetIsWebSearchMode = () =>
  useZustandCurrentChatStore((state) => state.setIsWebSearchMode);
export const useCurrentChatStoreSetIsSendingMessage = () =>
  useZustandCurrentChatStore((state) => state.setIsSendingMessage);
export const useCurrentChatStoreSetIsRecordingAudio = () =>
  useZustandCurrentChatStore((state) => state.setIsRecordingAudio);
export const useCurrentChatStoreSetIsSendingAudio = () =>
  useZustandCurrentChatStore((state) => state.setIsSendingAudio);
