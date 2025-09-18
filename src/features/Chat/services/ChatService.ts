import { apiClient } from "api";

export const getChatMessagesService = async (id: string, page: number = 0) => {
  return await apiClient.get<ChatMessagesRes>(
    `/chat/${id}/messages?page=${page}`
  );
};

export const sendNewMessageService = async (newMessageReq: FormData) => {
  return await apiClient.postFormData<NewMessageRes, FormData>(
    "/chat/send-user-message",
    newMessageReq
  );
};

export const streamAssistantMessageService = async (
  id: string,
  onChunk: (chunk: AssistantChunkRes) => void,
  signal?: AbortSignal
) => {
  return await apiClient.getStream<AssistantChunkRes>(
    `/chat/assistant-message/${id}`,
    onChunk,
    signal
  );
};

export const toggleWebSearchModeService = async (id: string) => {
  return await apiClient.patch(`/chat/${id}/toggle-web-search-mode`);
};

export const changeMaxOutputTokensService = async (
  id: string,
  maxOutputTokens: number
) => {
  return await apiClient.patch<{ maxOutputTokens: number }>(
    `/chat/${id}/change-max-output-tokens`,
    {
      maxOutputTokens,
    }
  );
};

export const deleteChatService = async (id: string) => {
  return await apiClient.del<{ message: string }>(`/chat/${id}/delete`);
};
