import { authenticatedApiClient } from "api/auth.api";
import { ChatMessagesRes } from "types/chat/ChatMessagesRes.type";
import { ChatsRes } from "types/chat/ChatsRes.type";
import { NewMessageRes } from "types/chat/NewMessageRes.type";

export const getAllChatsService = async () => {
  return await authenticatedApiClient.get<ChatsRes>("/chat/all");
};

export const getChatMessagesService = async (id: string, page: number = 0) => {
  return await authenticatedApiClient.get<ChatMessagesRes>(
    `/chat/${id}/messages?page=${page}`
  );
};

export const sendNewMessageService = async (newMessageReq: FormData) => {
  return await authenticatedApiClient.postFormData<NewMessageRes>(
    "/chat/send-message",
    newMessageReq
  );
};

export const deleteChatService = async (id: string) => {
  return await authenticatedApiClient.del(`/chat/${id}/delete`);
};

export const renameChatTitleService = async (id: string, newTitle: string) => {
  return await authenticatedApiClient.patch(`/chat/${id}/rename`, { title: newTitle });
};

export const changeMaxOutputTokensService = async (
  id: string,
  maxOutputTokens: number
) => {
  return await authenticatedApiClient.patch(`/chat/${id}/change-max-output-tokens`, {
    maxOutputTokens,
  });
};

export const toggleChatFavService = async (id: string) => {
  return await authenticatedApiClient.patch(`/chat/${id}/toggle-chat-fav`);
};
