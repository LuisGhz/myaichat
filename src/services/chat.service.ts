import { apiClient } from "api";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import { ChatsRes } from "types/chat/ChatsRes.type";
import { NewMessageRes } from "types/chat/NewMessageRes.type";

export const getAllChatsService = async () => {
  return await apiClient.get<ChatsRes>("/chat/all");
};

export const getChatMessagesService = async (id: string, page: number = 0) => {
  return await apiClient.get<ChatMessagesRes>(
    `/chat/${id}/messages?page=${page}`
  );
};

export const sendNewMessageService = async (newMessageReq: FormData) => {
  return await apiClient.postFormData<NewMessageRes, unknown>(
    "/chat/send-message",
    newMessageReq
  );
};

export const deleteChatService = async (id: string) => {
  return await apiClient.del(`/chat/${id}/delete`);
};

export const renameChatTitleService = async (id: string, newTitle: string) => {
  return await apiClient.patch(`/chat/${id}/rename`, { title: newTitle });
};

export const changeMaxOutputTokensService = async (
  id: string,
  maxOutputTokens: number
) => {
  return await apiClient.patch(`/chat/${id}/change-max-output-tokens`, {
    maxOutputTokens,
  });
}
