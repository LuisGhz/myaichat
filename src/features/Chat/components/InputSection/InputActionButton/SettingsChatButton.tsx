import { ChatConfigModal } from "features/Chat/modals/ChatConfigModal";
import { FileTypeLightConfigIcon } from "icons/FileTypeLightConfigIcon";
import { useState } from "react";

type Props = {
  buttonClassName?: string;
};

export const SettingsChatButton = ({ buttonClassName }: Props) => {
  const [isChatConfigModalOpen, setIsChatConfigModalOpen] = useState(false);

  return (
    <>
      <button
        className={`${buttonClassName}`}
        type="button"
        aria-label="Settings"
        title="Settings"
        onClick={() => setIsChatConfigModalOpen(true)}
      >
        <FileTypeLightConfigIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
      </button>
      {isChatConfigModalOpen && (
        <ChatConfigModal
          onClose={(newConfig) => {
            console.log("New Chat Config:", newConfig);
            setIsChatConfigModalOpen(false);
          }}
          currentMaxOutputTokens={1000}
          currentIsWebSearchMode={false}
        />
      )}
    </>
  );
};
