import { PlusIcon } from "assets/icons/PlusIcon";

export const AttachFile = () => {
  return (
    <button
      className={`text-white cursor-pointer mb-1 transition-all duration-200 delay-150 absolute left-[3%] md:left-6 xl:left-9 p-1 rounded-lg hover:bg-cop-6`}
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
