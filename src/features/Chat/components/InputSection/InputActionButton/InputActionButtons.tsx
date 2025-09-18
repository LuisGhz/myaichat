import { CurrentChatMetadata } from "./CurrentChatMetadata";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { SettingsChatButton } from "./SettingsChatButton";
import { AttachFileButton } from "./AttachFileButton";
import { MicrophoneButton } from "./MicrophoneButton";

export const InputActionButtons = () => {
  const params = useChatParams();
  const buttonsStyles =
    "cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200";

  return (
    <section className="flex justify-between">
      <div className="flex gap-2">
        <SettingsChatButton buttonClassName={buttonsStyles} />
        {params.id && <CurrentChatMetadata buttonClassName={buttonsStyles} />}
      </div>
      <div className="flex gap-2">
        <AttachFileButton buttonClassName={buttonsStyles} />
        <MicrophoneButton buttonClassName={buttonsStyles} />
      </div>
    </section>
  );
};
