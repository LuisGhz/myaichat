import { PlusIcon } from "assets/icons/PlusIcon";
import { useEffect, useRef } from "react";

export const AttachFile = () => {
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
    <button
      className={`text-white cursor-pointer mb-1 transition-all duration-200 delay-150 absolute left-[3%] md:left-6 xl:left-9 p-1 rounded-lg hover:bg-cop-6`}
      type="button"
      aria-label="Attach file"
      onClick={() => {
        optionsRef.current?.classList.toggle("hidden");
      }}
      ref={buttonRef}
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
