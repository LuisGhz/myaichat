import { useNavigate } from "react-router";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { deleteChatService } from "features/Chat/services/ChatService";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const useChatContext = () => {
  const navigate = useNavigate();
  const params = useChatParams();
  const { chatsSummary } = useAppStore();
  const { setChatsSummary } = useAppStoreActions();

  const deleteChat = async (chatId: string) => {
    const updatedChats = chatsSummary.filter((chat) => chat.id !== chatId);
    setChatsSummary(updatedChats);
    if (params.id === chatId) navigate("/chat");
    try {
      await deleteChatService(chatId);
    } catch (error) {
      setChatsSummary(chatsSummary);
      navigate(`/chat/${chatId}`);
      console.error("Failed to delete chat:", error);
    }
  };

  return {
    deleteChat,
  };
};
