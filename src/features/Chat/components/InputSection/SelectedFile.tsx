import { XMarkIcon } from "assets/icons/XMarkIcon";
import { ImageViewer } from "../ImageViewer";

type Props = {
  selectedFile: string;
  clearSelectedFile: () => void;
};

export const SelectedFile = ({ selectedFile, clearSelectedFile }: Props) => {
  return (
    <div className="w-full max-w-2/12 mb-2 relative">
      <ImageViewer file={selectedFile} />
      <button
        onClick={clearSelectedFile}
        className="absolute top-1 right-1 bg-cop-8 hover:bg-cop-9 text-white rounded-full p-1 text-xs"
        aria-label="Remove file"
      >
        <XMarkIcon className="size-3 cursor-pointer" />
      </button>
    </div>
  );
};
