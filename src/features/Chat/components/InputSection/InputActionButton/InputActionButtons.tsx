import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";
import { PaperClipIcon } from "icons/PaperClipIcon";
import { CurrentChatMetadata } from "../CurrentChatMetadata";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { SettingsChatButton } from "./SettingsChatButton";

export const InputActionButtons = () => {
  const params = useChatParams();

  return (
    <section className="flex justify-between">
      <div className="flex gap-2">
        <SettingsChatButton buttonClassName="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200" />
        {params.id && (
          <CurrentChatMetadata buttonClassName="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200" />
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
