import { CogSixToothIcon } from "assets/icons/CogSixToothIcon";
import { ChatConfigModal } from "../modals/ChatConfigModal/ChatConfigModal";
import { useState } from "react";
import {
  useCurrentChatStoreGetIsWebSearchMode,
  useCurrentChatStoreGetMaxOutputTokens,
} from "store/features/chat/useCurrentChatStore";
import { useParams } from "react-router";
import { useChats } from "hooks/features/Chat/useChats";
import { ChatConfigOnClose } from "types/chat/ChatConfigOnClose.type";

export const ChatConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ id?: string }>();
  const maxOutputTokens = useCurrentChatStoreGetMaxOutputTokens();
  const isWebSearchMode = useCurrentChatStoreGetIsWebSearchMode();
  const { changeMaxOutputTokens, changeIsWebSearchMode } = useChats();

  const onClose = async (newConfig: ChatConfigOnClose) => {
    setIsOpen(false);
    await updateMaxOutputTokens(newConfig.maxOutputTokens);
    await updateIsWebSearchMode(newConfig.isWebSearchMode);
  };

  const updateMaxOutputTokens = async (newMaxOutputTokens: number) => {
    if (params.id) {
      try {
        await changeMaxOutputTokens(
          params.id,
          maxOutputTokens,
          newMaxOutputTokens
        );
      } catch {
        console.error("Failed to change max output tokens.");
      }
      return;
    }
  };

  const updateIsWebSearchMode = async (newIsWebSearchMode: boolean) => {
    if (params.id) {
      try {
        await changeIsWebSearchMode(
          params.id,
          isWebSearchMode,
          newIsWebSearchMode
        );
      } catch {
        console.error("Failed to change web search mode.");
      }
    }
  };

  return (
    <button
      className="flex items-center gap-2 relative p-2 hover:bg-cop-6 rounded-full transition-colors duration-150"
      type="button"
      aria-label="Chat configuration"
    >
      {isOpen && (
        <ChatConfigModal
          isOpen={isOpen}
          onClose={onClose}
          currentMaxOutputTokens={maxOutputTokens}
          currentIsWebSearchMode={isWebSearchMode}
        />
      )}
      <CogSixToothIcon
        className={`text-white size-5 cursor-pointer transition-transform duration-300  ${
          isOpen ? "rotate-180" : ""
        }`}
        onClick={() => setIsOpen(true)}
      />
    </button>
  );
};
