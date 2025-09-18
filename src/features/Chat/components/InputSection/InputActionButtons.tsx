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
        <span className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200">
          <FileTypeLightConfigIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
        </span>
        {params.id && (
          <span className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200">
            <CurrentChatMetadata />
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <span className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200">
          <PaperClipIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
        </span>
        <span className="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200">
          <Microphone20SolidIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
        </span>
      </div>
    </section>
  );
};
