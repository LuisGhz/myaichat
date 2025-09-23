import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Grid } from "antd";
import { useChatStore, useChatStoreActions } from "store/app/ChatStore";
import { UploadFromSelection } from "./UploadFromSelection";
import { PaperClipIcon } from "icons/PaperClipIcon";
import { InfoModal } from "core/modals/InfoModal";

type Props = {
  buttonClassName?: string;
};

export const AttachFileButton = ({ buttonClassName }: Props) => {
  const { isRecordingAudio, isSendingAudio } = useChatStore();
  const { setSelectedFile } = useChatStoreActions();
  const [isInfoDialogOpen, setInfoDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const optionsRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const screens = Grid.useBreakpoint();

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
      setIsMobile(screens.md!);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectFile = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="relative">
      <InfoModal
        message={[
          "File type not supported (Only: jpg, jpeg, png, gif)",
          "or file size exceeded (max 2 MB).",
        ]}
        isOpen={isInfoDialogOpen}
        onConfirm={() => setInfoDialogOpen(false)}
      />
      <button
        className={`${buttonClassName} ${
          isRecordingAudio || isSendingAudio ? "hidden" : ""
        } app-fill`}
        type="button"
        aria-label="Attach file"
        onClick={() => {
          optionsRef.current?.classList.toggle("hidden");
        }}
        ref={buttonRef}
      >
        <PaperClipIcon className="size-6" />
      </button>
      <ul
        className="hidden rounded-lg mt-2 w-40 shadow-lg transition-all duration-200 delay-150 absolute z-10 bottom-full -left-36 font-semibold text-center [&>li]:bg-gray-200 [&>li]:hover:bg-gray-300 [&>li]:dark:bg-gray-950 [&>li]:dark:hover:bg-gray-700 app-text"
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
    </div>
  );
};
