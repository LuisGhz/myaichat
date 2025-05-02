import { PlusIcon } from "assets/icons/PlusIcon";
import { InfoDialog } from "components/Dialogs/InfoDialog";
import { useAttachedFilesValidator } from "hooks/useAttachedFilesValidator";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

type Props = {
  onSelectImage: (file: File) => void;
};

export const AttachFile = ({ onSelectImage }: Props) => {
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const optionsRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { validateFiles } = useAttachedFilesValidator();

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
        <PlusIcon className="size-5" />
        <ul
          className="hidden bg-cop-4 text-white rounded-lg mt-2 w-40 shadow-lg transition-all duration-200 delay-150 absolute z-10 bottom-full"
          ref={optionsRef}
        >
          <li className="hover:bg-cop-6 rounded-t-lg transition-colors duration-200">
            <Link
              className="block py-1.5"
              to="/chat"
              onClick={() => console.log("asd")}
            >
              <span>New conversation</span>
            </Link>
          </li>
          <li
            className="py-1.5 hover:bg-cop-6 rounded-b-lg transition-colors duration-200"
            onClick={makeClickToInputFile}
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
        </ul>
      </button>
    </>
  );
};
