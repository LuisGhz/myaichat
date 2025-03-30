import { apiClient } from "api";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import { ChatsRes } from "types/chat/ChatsRes.type";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import { NewMessageRes } from "types/chat/NewMessageRes.type";

export const getAllChatsService = async () => {
  return await apiClient.get<ChatsRes>("/chat/all");
};

export const getChatMessagesService = async (id: string) => {
  return await apiClient.get<ChatMessagesRes>(`/chat/${id}/messages`);
};

export const sendNewMessageService = async (newMessageReq: NewMessageReq) => {
  return await apiClient.post<NewMessageRes, unknown>(
    "/chat/send-message",
    newMessageReq
  );
};

export const deleteChatService = async (id: string) => {
  return await apiClient.del(`/chat/${id}/delete`);
};
