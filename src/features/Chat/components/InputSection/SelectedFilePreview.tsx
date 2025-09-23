import { Image } from "antd";
import { BaselineCloseIcon } from "icons/BaselineCloseIcon";

type Props = {
  selectedFile: File;
  removeSelectedFile: () => void;
};

export const SelectedFilePreview = ({
  selectedFile,
  removeSelectedFile,
}: Props) => {
  return (
    <>
      {selectedFile.type.startsWith("image/") ? (
        <div className="mb-2 px-2 py-4.5 relative w-28">
          <Image
            className="!w-full"
            src={URL.createObjectURL(selectedFile)}
            alt={selectedFile.name}
            aria-label="Selected image preview"
          />
          <button
            className="block absolute top-0 right-0 app-text text-lg cursor-pointer"
            type="button"
            aria-label="Remove selected image"
            onClick={removeSelectedFile}
          >
            <BaselineCloseIcon />
          </button>
        </div>
      ) : (
        <div className="mb-2 p-2 border border-gray-300 rounded">
          <p>{selectedFile.name}</p>
        </div>
      )}
    </>
  );
};
