import { PaperClipIcon } from "assets/icons/PaperClipIcon";
import { InfoDialog } from "components/Dialogs/InfoDialog";
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { UploadFromSelection } from "./UploadFromSelection";
import { ScreensWidth } from "consts/ScreensWidth";

type Props = {
  onSelectFile: (file: File) => void;
};

export const AttachFile = ({ onSelectFile }: Props) => {
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const optionsRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const PasteFromClipboard = !isMobile
    ? lazy(() =>
        import("./PasteFromClipboard").then((module) => ({
          default: module.PasteFromClipboard,
        }))
      )
    : undefined;

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < ScreensWidth.tablet);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
            onSelectFile={onSelectFile}
            setInfoDialogOpen={setInfoDialogOpen}
            optionsRef={optionsRef}
          />
          {!isMobile && PasteFromClipboard && (
            <Suspense fallback={null}>
              <PasteFromClipboard
                optionsRef={optionsRef}
                setInfoDialogOpen={setInfoDialogOpen}
                onSelectFile={onSelectFile}
              />
            </Suspense>
          )}
        </ul>
      </button>
    </>
  );
};
