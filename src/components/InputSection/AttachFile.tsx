import { PlusIcon } from "assets/icons/PlusIcon";

export const AttachFile = () => {
  return (
    <button
      className="text-white cursor-pointer mx-4 mb-2"
      type="button"
      aria-label="Attach file"
      onClick={() => {
        // Handle file attachment logic here
        alert("File attachment functionality is not implemented yet.");
      }}
    >
      <PlusIcon />
    </button>
  );
};
