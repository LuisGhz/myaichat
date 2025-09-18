import { FileTypeLightConfigIcon } from "icons/FileTypeLightConfigIcon";
import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";
import { PaperClipIcon } from "icons/PaperClipIcon";
import { CurrentChatMetadata } from "./CurrentChatMetadata";
import { useChatParams } from "features/Chat/hooks/useChatParams";

export const InputActionButtons = () => {
  const params = useChatParams();

  return (
    <section className="flex justify-between">
      <div className="flex gap-2">
        <button
          className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200"
          type="button"
          aria-label="Settings"
          title="Settings"
        >
          <FileTypeLightConfigIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
        </button>
        {params.id && (
          <span
            className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200"
            title="Chat info"
          >
            <CurrentChatMetadata />
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200"
          type="button"
          aria-label="Attach file"
          title="Attach file"
        >
          <PaperClipIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
        </button>
        <button
          className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200"
          type="button"
          aria-label="Voice input"
          title="Voice input"
        >
          <Microphone20SolidIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
        </button>
      </div>
    </section>
  );
};
