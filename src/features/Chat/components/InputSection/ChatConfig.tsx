import { CogSixToothIcon } from "assets/icons/CogSixToothIcon";
import { ChatConfigModal } from "../modals/ChatConfigModal";
import { useState } from "react";
import {
  useCurrentChatStoreGetMaxOutputTokens,
  useCurrentChatStoreSetMaxOutputTokens,
} from "store/features/chat/useCurrentChatStore";
import { useParams } from "react-router";
import { useChats } from "hooks/useChats";

export const ChatConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams<{ id?: string }>();
  const maxOutputTokens = useCurrentChatStoreGetMaxOutputTokens();
  const setMaxOutputTokens = useCurrentChatStoreSetMaxOutputTokens();
  const { changeMaxOutputTokens } = useChats();

  const onCancel = async (newMaxOutputTokens: number) => {
    setIsOpen(false);
    if (newMaxOutputTokens === maxOutputTokens) return;
    if (params.id) {
      try {
        await changeMaxOutputTokens(params.id, newMaxOutputTokens);
        setMaxOutputTokens(newMaxOutputTokens);
      } catch {
        console.error("Failed to change max output tokens.");
      }
      return;
    }
    setMaxOutputTokens(newMaxOutputTokens);
  };

  return (
    <button
      className="flex items-center gap-2 relative p-2 hover:bg-cop-6 rounded-full transition-colors duration-150"
      type="button"
      aria-label="Chat configuration"
    >
      <ChatConfigModal
        isOpen={isOpen}
        maxOutputTokens={maxOutputTokens}
        onCancel={onCancel}
      />
      <CogSixToothIcon
        className={`text-white size-5 cursor-pointer transition-transform duration-300  ${
          isOpen ? "rotate-180" : ""
        }`}
        onClick={() => setIsOpen(true)}
      />
    </button>
  );
};
