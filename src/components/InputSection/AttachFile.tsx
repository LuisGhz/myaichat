import { PlusIcon } from "assets/icons/PlusIcon";
import { useAttachedFilesValidator } from "hooks/useAttachedFilesValidator";
import { useEffect, useRef } from "react";
import { Link } from "react-router";

type Props = {
  onSelectImage: (file: File) => void;
};

export const AttachFile = ({ onSelectImage }: Props) => {
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
    inputFileRef.current?.click();
  };

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isValid = validateFiles(file);
    if (!isValid) {
      console.error("Invalid file type or size exceeded.");
      event.target.value = "";
      return;
    }
    onSelectImage(file);
    event.target.value = "";
  };

  return (
    <button
      className={`text-white cursor-pointer mb-1 transition-all duration-200 delay-150 absolute bottom-2 left-[2%] md:left-4 xl:left-[2.5%] p-1 rounded-lg hover:bg-cop-6`}
      type="button"
      aria-label="Attach file"
      onClick={() => {
        optionsRef.current?.classList.toggle("hidden");
      }}
      ref={buttonRef}
    >
      <PlusIcon className="size-8" />
      <ul
        className="absolute hidden bg-cop-4 text-white rounded-lg mt-2 w-40 shadow-lg transition-all duration-200 delay-150 bottom-full -right-28 md:-right-2 z-50"
        ref={optionsRef}
      >
        <li className="py-1.5 hover:bg-cop-6 rounded-t-lg transition-colors duration-200">
          <Link to="/chat">New conversation</Link>
        </li>
        <li
          className="py-1.5 hover:bg-cop-6 rounded-b-lg transition-colors duration-200"
          onClick={makeClickToInputFile}
        >
          Upload
          <input
            className="hidden"
            accept="image/*"
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
  );
};
