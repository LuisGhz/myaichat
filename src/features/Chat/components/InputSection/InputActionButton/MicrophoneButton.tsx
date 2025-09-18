import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";

type Props ={
  buttonClassName?: string;
}

export const MicrophoneButton = ({ buttonClassName }: Props) => {
  return (
    <button
      className={`${buttonClassName}`}
      type="button"
      aria-label="Voice input"
      title="Voice input"
    >
      <Microphone20SolidIcon className="w-6 h-6 fill-gray-700 dark:fill-gray-200" />
    </button>
  );
};
