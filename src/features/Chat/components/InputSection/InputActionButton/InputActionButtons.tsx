import { CurrentChatMetadata } from "./CurrentChatMetadata";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { SettingsChatButton } from "./SettingsChatButton";
import { AttachFileButton } from "./AttachFileButton";
import { MicrophoneButton } from "./MicrophoneButton";

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
        <AttachFileButton buttonClassName="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200" />
        <MicrophoneButton buttonClassName="cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200" />
      </div>
    </section>
  );
};
