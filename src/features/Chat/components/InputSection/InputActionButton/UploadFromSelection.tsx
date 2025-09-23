import { useAttachedFilesValidator } from "features/Chat/hooks/useAttachedFileValidator";
import { useRef } from "react";

// Add Props type for not founded names
type Props = {
  onSelectFile: (file: File) => void;
  setInfoDialogOpen: (open: boolean) => void;
  optionsRef: React.RefObject<HTMLUListElement | null>;
};

export const UploadFromSelection = ({
  onSelectFile,
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

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isValid = validateFiles(file);
    if (!isValid) {
      console.error("Invalid file type or size exceeded.");
      event.target.value = "";
      setInfoDialogOpen(true);
      return;
    }
    onSelectFile(file);
    event.target.value = "";
  };

  return (
    <li
      className="py-1.5 rounded-t-lg transition-colors duration-200 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        makeClickToInputFile();
      }}
    >
      <span>Upload</span>
      <input
        className="hidden"
        accept="image/jpeg, image/png, image/jpg, image/gif"
        type="file"
        name="attach-file"
        id="attach-file"
        ref={inputFileRef}
        onChange={handleFileSelection}
        data-testid="file-input"
      />
    </li>
  );
};
