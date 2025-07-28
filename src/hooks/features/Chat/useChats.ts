import { useState } from "react";
import { useToast } from "hooks/useToast";
import {
  getAllChatsService,
  getChatMessagesService,
  sendNewMessageService,
  deleteChatService,
  renameChatTitleService,
  changeMaxOutputTokensService,
  toggleChatFavService,
  changeIsWebSearchModeService,
} from "services/chat.service";
import { NewMessageReq } from "types/chat/NewMessageReq.type";
import {
  useAppDeleteChatByIdStore,
  useAppSetChatsStore,
} from "store/useAppStore";

export const useChats = () => {
  const [isEmptyPage, setIsEmptyPage] = useState(false);
  const { toastError, toastSuccess } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const setChats = useAppSetChatsStore();
  const deleteChatById = useAppDeleteChatByIdStore();

  const getAllChats = async () => {
    try {
      const chatRes = await getAllChatsService();
      const chats = chatRes?.chats.reverse() || [];
      setChats(chats);
    } catch {
      toastError("Error fetching chats, please try again later.");
    }
  };

  const getChatMessages = async (id: string, page?: number) => {
    try {
      setIsChatLoading(() => true);
      const res = await getChatMessagesService(id, page);
      if (res?.historyMessages.length === 0 && page && page > 0)
        setIsEmptyPage(() => true);
      setIsChatLoading(() => false);
      return res;
    } catch {
      toastError("Error fetching chat messages, please try again later.");
    }
  };

  const sendNewMessage = async (newMessageOps: NewMessageReq) => {
    const formData = new FormData();
    formData.append("prompt", newMessageOps.prompt);
    formData.append("maxOutputTokens", String(newMessageOps.maxOutputTokens));
    formData.append("isWebSearchMode", String(newMessageOps.isWebSearchMode));
    if (newMessageOps.model) formData.append("model", newMessageOps.model);
    if (newMessageOps.chatId) formData.append("chatId", newMessageOps.chatId);
    if (newMessageOps.file) formData.append("file", newMessageOps.file);
    if (newMessageOps.promptId)
      formData.append("promptId", newMessageOps.promptId);
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
      await deleteChatService(id);
      deleteChatById(id);
    } catch {
      toastError("Error deleting chat, please try again later.");
    }
  };

  const renameChatTitle = async (id: string, newTitle: string) => {
    try {
      await renameChatTitleService(id, newTitle);
      toastSuccess("Chat renamed successfully!");
    } catch {
      toastError("Error renaming chat, please try again later.");
    }
  };

  const changeMaxOutputTokens = async (
    id: string,
    maxOutputTokens: number,
    newMaxOutputTokens: number
  ) => {
    try {
      if (newMaxOutputTokens === maxOutputTokens) return;
      await changeMaxOutputTokensService(id, newMaxOutputTokens);
    } catch {
      toastError("Error changing max output tokens, please try again later.");
    }
  };

  const changeIsWebSearchMode = async (
    id: string,
    isWebSearchMode: boolean,
    newIsWebSearchMode: boolean
  ) => {
    try {
      if (newIsWebSearchMode === isWebSearchMode) return;
      await changeIsWebSearchModeService(id, newIsWebSearchMode);
    } catch {
      toastError("Error changing web search mode, please try again later.");
    }
  };

  const toggleChatFav = async (id: string) => {
    try {
      await toggleChatFavService(id);
    } catch {
      toastError(
        "Error updating chat favorite status, please try again later."
      );
    }
  };

  return {
    getAllChats,
    getChatMessages,
    sendNewMessage,
    deleteChat,
    renameChatTitle,
    changeMaxOutputTokens,
    changeIsWebSearchMode,
    toggleChatFav,
    isSending,
    isEmptyPage,
    setIsEmptyPage,
    isChatLoading,
  };
};
