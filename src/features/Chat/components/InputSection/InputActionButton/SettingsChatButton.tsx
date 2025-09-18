import { FileTypeLightConfigIcon } from "icons/FileTypeLightConfigIcon";

type Props = {
  buttonClassName?: string;
};

export const SettingsChatButton = ({ buttonClassName }: Props) => {
  return (
    <button
      className={`${buttonClassName}`}
      type="button"
      aria-label="Settings"
      title="Settings"
    >
      <FileTypeLightConfigIcon className="w-6 h-6 cursor-pointer fill-gray-700 dark:fill-gray-200" />
    </button>
  );
};
