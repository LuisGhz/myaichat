import { useAttachedFilesValidator } from "features/Chat/hooks/useAttachedFileValidator";

type Props = {
  optionsRef: React.RefObject<HTMLElement | null>;
  setInfoDialogOpen: (open: boolean) => void;
  onSelectFile: (file: File) => void;
};

export const PasteFromClipboard = ({
  optionsRef,
  setInfoDialogOpen,
  onSelectFile,
}: Props) => {
  const { validateFiles } = useAttachedFilesValidator();

  const handlePasteFromClipboard = async () => {
    // Hide menu immediately when function is called
    if (!optionsRef.current?.classList.contains("hidden"))
      optionsRef.current?.classList.add("hidden");

    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const file = new File(
              [blob],
              `clipboard-image.${type.split("/")[1]}`,
              { type }
            );

            const isValid = validateFiles(file);
            if (!isValid) {
              console.error("Invalid file type or size exceeded.");
              setInfoDialogOpen(true);
              return;
            }

            onSelectFile(file);
            return;
          }
        }
      }

      console.warn("No image found in clipboard.");
    } catch (error) {
      console.error("Failed to read clipboard contents:", error);
    }
  };

  return (
    <li
      className="py-1.5 hover:bg-cop-6 rounded-b-lg transition-colors duration-200 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        handlePasteFromClipboard();
      }}
      data-testid="paste-from-clipboard"
      aria-label="Paste from Clipboard"
    >
      Paste from Clipboard
    </li>
  );
};
