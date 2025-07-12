import { PaperClipIcon } from "assets/icons/PaperClipIcon";
import { InfoDialog } from "components/Dialogs/InfoDialog";
import { useEffect, useRef, useState } from "react";
import { PasteFromClipboard } from "./PasteFromClipboard";
import { UploadFromSelection } from "./UploadFromSelection";

type Props = {
  onSelectImage: (file: File) => void;
};

export const AttachFile = ({ onSelectImage }: Props) => {
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !optionsRef.current?.classList.contains("hidden")
      )
        optionsRef.current?.classList.add("hidden");
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <InfoDialog
        message={[
          "File type not supported (Only: jpg, jpeg, png, gif)",
          "or file size exceeded (max 2 MB).",
        ]}
        isOpen={isInfoDialogOpen}
        onConfirm={() => setInfoDialogOpen(false)}
      />
      <button
        className={`text-white cursor-pointer mb-1 transition-all duration-200 delay-150 p-1 rounded-full hover:bg-cop-6 relative`}
        type="button"
        aria-label="Attach file"
        onClick={() => {
          optionsRef.current?.classList.toggle("hidden");
        }}
        ref={buttonRef}
      >
        <PaperClipIcon className="size-6" />
        <ul
          className="hidden bg-cop-4 text-white rounded-lg mt-2 w-40 shadow-lg transition-all duration-200 delay-150 absolute z-10 bottom-full"
          ref={optionsRef}
        >
          <UploadFromSelection
            onSelectImage={onSelectImage}
            setInfoDialogOpen={setInfoDialogOpen}
            optionsRef={optionsRef}
          />
          <PasteFromClipboard
            optionsRef={optionsRef}
            setInfoDialogOpen={setInfoDialogOpen}
            onSelectImage={onSelectImage}
          />
        </ul>
      </button>
    </>
  );
};
