import { PaperClipIcon } from "icons/PaperClipIcon";
import { useChatStore } from "store/app/ChatStore";

type Props = {
  buttonClassName?: string;
};

export const AttachFileButton = ({ buttonClassName }: Props) => {
  const { isRecordingAudio, isSendingAudio } = useChatStore();

  return (
    <button
      className={`${buttonClassName} ${isRecordingAudio || isSendingAudio ? "hidden" : ""}`}
      type="button"
      aria-label="Attach file"
      title="Attach file"
    >
      <PaperClipIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
    </button>
  );
};
