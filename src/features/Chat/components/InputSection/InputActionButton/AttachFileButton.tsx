import { PaperClipIcon } from "icons/PaperClipIcon";

type Props = {
  buttonClassName?: string;
};

export const AttachFileButton = ({ buttonClassName }: Props) => {
  return (
    <button
      className={`${buttonClassName}`}
      type="button"
      aria-label="Attach file"
      title="Attach file"
    >
      <PaperClipIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
    </button>
  );
};
