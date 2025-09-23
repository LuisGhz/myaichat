import { useRef, useEffect } from "react";

type Props = {
  message: string | string[];
  onConfirm?: () => void;
  isOpen: boolean;
};

export const InfoModal = ({ message, onConfirm, isOpen }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog
      className="py-8 px-6 rounded-lg border-none shadow-lg w-11/12 min-w-[320px] max-w-[500px] text-center transition-opacity bg-gray-200 dark:bg-gray-950 app-text fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      ref={dialogRef}
    >
      <div style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
        {!Array.isArray(message) ? (
          <p>{message}</p>
        ) : (
          message.map((msg, index) => (
            <p key={index} style={{ margin: "0.5rem 0" }}>
              {msg}
            </p>
          ))
        )}
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer transition-all duration-200"
          onClick={() => {
            dialogRef.current?.close();
            if (onConfirm) onConfirm();
          }}
          type="button"
        >
          Ok
        </button>
      </div>
    </dialog>
  );
};
