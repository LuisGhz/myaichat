import { useState } from "react";
import { useToast } from "hooks/useToast";
import {
  getAllChatsService,
  getChatMessagesService,
  sendNewMessageService,
  deleteChatService,
} from "services/chat.service";
import { NewMessageReq } from "types/chat/NewMessageReq.type";

export const useChats = () => {
  const [isEmptyPage, setIsEmptyPage] = useState(false);
  const { toastError } = useToast();

  const [isSending, setIsSending] = useState(false);
  const getAllChats = async () => {
    const chatRes = await getAllChatsService();
    const chats = chatRes?.chats || [];
    return chats;
  };

  const getChatMessages = async (id: string, page?: number) => {
    try {
      const res = await getChatMessagesService(id, page);
      if (res?.historyMessages.length === 0 && page && page > 0)
        setIsEmptyPage(() => true);
      return res;
    } catch {
      toastError("Error fetching chat messages, please try again later.");
    }
  };

  const sendNewMessage = async (newMessageOps: NewMessageReq) => {
    const formData = new FormData();
    formData.append("prompt", newMessageOps.prompt);
    if (newMessageOps.model) formData.append("model", newMessageOps.model);
    if (newMessageOps.chatId) formData.append("chatId", newMessageOps.chatId);
    if (newMessageOps.image) formData.append("image", newMessageOps.image);
    setIsSending(true);
    try {
      const res = await sendNewMessageService(formData);
      setTimeout(() => {
        setIsSending(false);
      }, 100);
      return res;
    } catch {
      setIsSending(false);
      toastError("Error sending message, please try again later.");
    }
  };

  const deleteChat = async (id: string) => {
    try {
      return await deleteChatService(id);
    } catch {
      toastError("Error deleting chat, please try again later.");
    }
  };

  return {
    getAllChats,
    getChatMessages,
    sendNewMessage,
    deleteChat,
    isSending,
    isEmptyPage,
    setIsEmptyPage,
  };
};
