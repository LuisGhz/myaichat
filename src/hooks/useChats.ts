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
    const res = await getChatMessagesService(id);
    const messages = res?.historyMessages || [];
    return messages;
  };

  const sendNewMessage = async (newMessageOps: NewMessageReq) => {
    const res = await sendNewMessageService(newMessageOps);
    return res;
  };

  return { getAllChats, getChatMessages, sendNewMessage };
};
