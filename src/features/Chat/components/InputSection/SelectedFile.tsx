import { XMarkIcon } from "assets/icons/XMarkIcon";

type Props = {
  selectedImage: string;
  clearSelectedImage: () => void;
}

export const SelectedFile = ({ selectedImage, clearSelectedImage }: Props) => {
  return (
    <div className="w-full max-w-2/12 mb-2 relative">
      <img
        src={selectedImage}
        alt="Selected attachment"
        className="max-h-40 rounded-md object-contain"
      />
      <button
        onClick={clearSelectedImage}
        className="absolute top-1 right-1 bg-cop-8 hover:bg-cop-9 text-white rounded-full p-1 text-xs"
        aria-label="Remove image"
      >
        <XMarkIcon className="size-3 cursor-pointer" />
      </button>
    </div>
  );
};
