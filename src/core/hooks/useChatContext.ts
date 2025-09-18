import { deleteChatService } from "features/Chat/services/ChatService";

export const useChatContext = () => {
  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatService(chatId);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  return {
    deleteChat,
  };
};
