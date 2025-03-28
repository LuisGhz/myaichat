import {
  getAllChatsService,
  getChatMessagesService,
  sendNewMessageService,
} from "services/chat.service";
import { NewMessageReq } from "types/chat/NewMessageReq.type";

export const useChats = () => {
  const getAllChats = async () => {
    const chatRes = await getAllChatsService();
    const chats = chatRes?.chats || [];
    return chats;
  };

  const getChatMessages = async (id: string) => {
    return await getChatMessagesService(id);
  };

  const sendNewMessage = async (newMessageOps: NewMessageReq) => {
    const res = await sendNewMessageService(newMessageOps);
    return res;
  };

  return { getAllChats, getChatMessages, sendNewMessage };
};
