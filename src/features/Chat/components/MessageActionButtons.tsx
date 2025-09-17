import { useState } from "react";
import { BaselineContentCopyIcon } from "icons/BaselineContentCopyIcon";
import { BaselineCheckIcon } from "icons/BaselineCheckIcon";
import { SoundMaxFillIcon } from "icons/SoundMaxFillIcon";

type Props = {
  role: "User" | "Assistant";
  content: string;
};

export const MessageActionButtons = ({ role, content }: Props) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setShowCopied(true);
      setTimeout(() => {
        setShowCopied(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };
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
        onClick={handleCopyToClipboard}
      >
        {showCopied ? <BaselineCheckIcon /> : <BaselineContentCopyIcon />}
      </button>
    </section>
  );
};
