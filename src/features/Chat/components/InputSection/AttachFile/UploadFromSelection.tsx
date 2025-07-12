import { useAttachedFilesValidator } from "hooks/useAttachedFilesValidator";
import { useRef } from "react";

// Add Props type for not founded names
type Props = {
  onSelectImage: (file: File) => void;
  setInfoDialogOpen: (open: boolean) => void;
  optionsRef: React.RefObject<HTMLUListElement | null>;
};

export const UploadFromSelection = ({
  onSelectImage,
  setInfoDialogOpen,
  optionsRef,
}: Props) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { validateFiles } = useAttachedFilesValidator();

  const makeClickToInputFile = () => {
    if (!optionsRef.current?.classList.contains("hidden"))
      optionsRef.current?.classList.add("hidden");
    inputFileRef.current?.click();
  };

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isValid = validateFiles(file);
    if (!isValid) {
      console.error("Invalid file type or size exceeded.");
      event.target.value = "";
      setInfoDialogOpen(true);
      return;
    }
    onSelectImage(file);
    event.target.value = "";
  };

  return (
    <li
      className="py-1.5 hover:bg-cop-6 rounded-t-lg transition-colors duration-200 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        makeClickToInputFile();
      }}
    >
      Upload
      <input
        className="hidden"
        accept="image/jpeg, image/png, image/jpg, image/gif"
        type="file"
        name="attach-file"
        id="attach-file"
        ref={inputFileRef}
        onChange={onSelectFile}
        data-testid="file-input"
      />
    </li>
  );
};
