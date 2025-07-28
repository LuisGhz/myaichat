import { CogSixToothIcon } from "assets/icons/CogSixToothIcon";
import { ChatConfigModal } from "../modals/ChatConfigModal/ChatConfigModal";
import { useState } from "react";
import {
  useCurrentChatStoreGetIsWebSearchMode,
  useCurrentChatStoreGetMaxOutputTokens,
  useCurrentChatStoreSetIsWebSearchMode,
  useCurrentChatStoreSetMaxOutputTokens,
} from "store/features/chat/useCurrentChatStore";
import { useParams } from "react-router";
import { useChats } from "hooks/features/Chat/useChats";
import { ChatConfigOnClose } from "types/chat/ChatConfigOnClose.type";

export const ChatConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ id?: string }>();
  const maxOutputTokens = useCurrentChatStoreGetMaxOutputTokens();
  const setMaxoutputTokens = useCurrentChatStoreSetMaxOutputTokens();
  const isWebSearchMode = useCurrentChatStoreGetIsWebSearchMode();
  const setIsWebSearchMode = useCurrentChatStoreSetIsWebSearchMode();
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
        setMaxoutputTokens(newMaxOutputTokens);
      } catch {
        console.error("Failed to change max output tokens.");
      }
      return;
    }
    setMaxoutputTokens(newMaxOutputTokens);
  };

  const updateIsWebSearchMode = async (newIsWebSearchMode: boolean) => {
    if (params.id) {
      try {
        await changeIsWebSearchMode(
          params.id,
          isWebSearchMode,
          newIsWebSearchMode
        );
        setIsWebSearchMode(newIsWebSearchMode);
      } catch {
        console.error("Failed to change web search mode.");
      }
    }
    setIsWebSearchMode(newIsWebSearchMode);
  };

  return (
    <>
      {isOpen && (
        <ChatConfigModal
          onClose={onClose}
          currentMaxOutputTokens={maxOutputTokens}
          currentIsWebSearchMode={isWebSearchMode}
        />
      )}
      <button
        className="flex items-center gap-2 relative p-2 hover:bg-cop-6 rounded-full transition-colors duration-150 cursor-pointer"
        type="button"
        aria-label="Chat configuration"
        onClick={() => setIsOpen(true)}
      >
        <CogSixToothIcon
          className={`text-white size-5 transition-transform duration-300  ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </>
  );
};
