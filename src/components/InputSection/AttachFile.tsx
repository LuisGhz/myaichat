import { PlusIcon } from "assets/icons/PlusIcon";
import { useRef } from "react";

export const AttachFile = () => {
  const optionsRef = useRef<HTMLUListElement>(null);

  return (
    <button
      className={`text-white cursor-pointer mb-1 transition-all duration-200 delay-150 absolute left-[3%] md:left-6 xl:left-9 p-1 rounded-lg hover:bg-cop-6`}
      type="button"
      aria-label="Attach file"
      onClick={() => {
        // Handle file attachment logic here
        // alert("File attachment functionality is not implemented yet.");
        optionsRef.current?.classList.toggle("hidden");
      }}
    >
      <PlusIcon />
      <ul
        className="absolute hidden bg-cop-4 text-white rounded-lg mt-2 w-40 shadow-lg transition-all duration-200 delay-150 bottom-full -right-28 md:-right-2 z-50"
        ref={optionsRef}
      >
        <li className="py-1.5 hover:bg-cop-6 rounded-t-lg transition-colors duration-200">
          New conversation
        </li>
        <li className="py-1.5 hover:bg-cop-6 rounded-b-lg transition-colors duration-200">
          Upload
        </li>
      </ul>
    </button>
  );
};
