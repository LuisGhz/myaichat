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
