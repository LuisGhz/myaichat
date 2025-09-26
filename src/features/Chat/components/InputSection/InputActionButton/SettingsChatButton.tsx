import { useChat } from "features/Chat/hooks/useChat";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { ChatConfigModal } from "features/Chat/modals/ChatConfigModal";
import { FileTypeLightConfigIcon } from "icons/FileTypeLightConfigIcon";
import { useState } from "react";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";

type Props = {
  buttonClassName?: string;
};

export const SettingsChatButton = ({ buttonClassName }: Props) => {
  const [isChatConfigModalOpen, setIsChatConfigModalOpen] = useState(false);
  const { toggleIsWebSearchMode, changeMaxOutputTokens } = useChat();
  const { maxOutputTokens, isWebSearchMode } = useChatStore();
  const { setMaxOutputTokens, setIsWebSearchMode } = useChatStoreActions();
  const params = useChatParams();

  const openModal = () => {
    setIsChatConfigModalOpen(true);
  };

  const handleNewConfig = async (newConfig: ChatConfigOnClose) => {
    if (maxOutputTokens !== newConfig.maxOutputTokens) {
      try {
        if (params.id)
          await changeMaxOutputTokens(params.id, newConfig.maxOutputTokens);
        setMaxOutputTokens(newConfig.maxOutputTokens);
      } catch (error) {
        console.error("Error updating max output tokens:", error);
      }
    }
    if (isWebSearchMode !== newConfig.isWebSearchMode) {
      try {
        if (params.id)
          await toggleIsWebSearchMode(params.id, newConfig.isWebSearchMode);
        setIsWebSearchMode(newConfig.isWebSearchMode);
      } catch (error) {
        console.error("Error updating web search mode:", error);
      }
    }
  };

  return (
    <>
      <button
        className={`${buttonClassName}`}
        type="button"
        aria-label="Settings"
        title="Settings"
        onClick={openModal}
      >
        <FileTypeLightConfigIcon
          className={`w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200 transition-transform duration-200 ${
            isChatConfigModalOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isChatConfigModalOpen && (
        <ChatConfigModal
          onClose={(newConfig) => {
            handleNewConfig(newConfig);
            setIsChatConfigModalOpen(false);
          }}
          currentMaxOutputTokens={maxOutputTokens}
          currentIsWebSearchMode={isWebSearchMode}
        />
      )}
    </>
  );
};
