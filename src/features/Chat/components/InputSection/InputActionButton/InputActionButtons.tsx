import { CurrentChatMetadata } from "./CurrentChatMetadata";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { SettingsChatButton } from "./SettingsChatButton";
import { AttachFileButton } from "./AttachFileButton";
import { MicrophoneButton } from "./MicrophoneButton";
import { useChatStore } from "store/app/ChatStore";

type Props = {
  onTranscription: (transcription: string) => void;
};

export const InputActionButtons = ({ onTranscription }: Props) => {
  const { isRecordingAudio, isSendingAudio } = useChatStore();
  const params = useChatParams();
  const buttonsStyles =
    "cursor-pointer rounded-full p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 transition-c-200";

  return (
    <section className="flex justify-between">
      <div
        className={`flex gap-2 ${
          isRecordingAudio || isSendingAudio ? "hidden" : ""
        }`}
      >
        <SettingsChatButton buttonClassName={buttonsStyles} />
        {params.id && <CurrentChatMetadata buttonClassName={buttonsStyles} />}
      </div>
      <div className={`flex gap-2 ${isRecordingAudio ? "mx-auto" : ""}`}>
        <AttachFileButton buttonClassName={buttonsStyles} />
        <MicrophoneButton
          buttonClassName={buttonsStyles}
          onTranscription={onTranscription}
        />
      </div>
    </section>
  );
};
