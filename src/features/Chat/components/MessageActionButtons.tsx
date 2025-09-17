import { BaselineContentCopyIcon } from "icons/BaselineContentCopyIcon";
import { SoundMaxFillIcon } from "icons/SoundMaxFillIcon";

type Props = {
  role: "User" | "Assistant";
};

export const MessageActionButtons = ({ role }: Props) => {
  return (
    <section
      className={`absolute -bottom-7 ${
        role === "User" ? "right-2" : "left-2"
      } flex gap-3`}
    >
      <button
        className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-950 dark:hover:bg-gray-800 text-app transition-colors duration-200 p-1 rounded cursor-pointer"
        type="button"
      >
        <SoundMaxFillIcon />
      </button>
      <button
        className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-950 dark:hover:bg-gray-800 text-app transition-colors duration-200 p-1 rounded cursor-pointer"
        type="button"
      >
        <BaselineContentCopyIcon />
      </button>
    </section>
  );
};
