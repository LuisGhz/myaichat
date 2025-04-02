import { useState } from "react";
import {
  getAllChatsService,
  getChatMessagesService,
  sendNewMessageService,
  deleteChatService,
} from "services/chat.service";
import { NewMessageReq } from "types/chat/NewMessageReq.type";

export const useChats = () => {
  const [isSending, setIsSending] = useState(false);
  const getAllChats = async () => {
    const chatRes = await getAllChatsService();
    const chats = chatRes?.chats || [];
    return chats;
  };

  const getChatMessages = async (id: string) => {
    return await getChatMessagesService(id);
  };

  const sendNewMessage = async (newMessageOps: NewMessageReq) => {
    setIsSending(true);
    const res = await sendNewMessageService(newMessageOps);
    setTimeout(() => {
      setIsSending(false);
    }, 100);
    return res;
  };

  const deleteChat = async (id: string) => {
    return await deleteChatService(id);
  };

  return {
    getAllChats,
    getChatMessages,
    sendNewMessage,
    deleteChat,
    isSending,
  };
};
