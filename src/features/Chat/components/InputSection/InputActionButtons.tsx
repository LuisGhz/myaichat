import { ExclamationCircleIcon } from "icons/ExclamationCircleIcon";
import { FileTypeLightConfigIcon } from "icons/FileTypeLightConfigIcon";
import { Microphone20SolidIcon } from "icons/Microphone20SolidIcon";
import { PaperClipIcon } from "icons/PaperClipIcon";

export const InputActionButtons = () => {
  return (
    <section className="flex justify-between">
      <div className="flex gap-2">
        <span>
          <FileTypeLightConfigIcon className="w-6 h-6 cursor-pointer fill-gray-700" />
        </span>
        <span>
          <ExclamationCircleIcon className="w-6 h-6 cursor-pointer fill-gray-700" />
        </span>
      </div>
      <div className="flex gap-2">
        <span>
          <PaperClipIcon className="w-6 h-6 cursor-pointer fill-gray-700" />
        </span>
        <span>
          <Microphone20SolidIcon className="w-6 h-6 cursor-pointer fill-gray-700" />
        </span>
      </div>
    </section>
  );
};
