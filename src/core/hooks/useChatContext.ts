import { useNavigate } from "react-router";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import {
  deleteChatService,
  renameChatService,
} from "features/Chat/services/ChatService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";
import { useAppMessage } from "shared/hooks/useAppMessage";

export const useChatContext = () => {
  const navigate = useNavigate();
  const params = useChatParams();
  const { chatsSummary } = useAppStore();
  const { setChatsSummary } = useAppStoreActions();
  const { errorMessage } = useAppMessage();

  const deleteChat = async (chatId: string) => {
    const updatedChats = chatsSummary.filter((chat) => chat.id !== chatId);
    setChatsSummary(updatedChats);
    if (params.id === chatId) navigate("/chat");
    try {
      await deleteChatService(chatId);
    } catch (error) {
      setChatsSummary(chatsSummary);
      navigate(`/chat/${chatId}`);
      errorMessage("Failed to delete chat. Please try again later.");
      console.error("Failed to delete chat:", error);
    }
  };

  const renameChat = async (id: string, newName: string) => {
    const updatedChats = chatsSummary.map((chat) =>
      chat.id === id ? { ...chat, title: newName } : chat
    );
    setChatsSummary(updatedChats);
    try {
      await renameChatService(id, newName);
    } catch (error) {
      setChatsSummary(chatsSummary);
      errorMessage("Error renaming chat. Please try again later.");
      console.error("Error renaming chat:", error);
    }
  };

  return {
    deleteChat,
    renameChat,
  };
};
