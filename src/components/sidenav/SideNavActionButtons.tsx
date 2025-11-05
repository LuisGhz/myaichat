import { useNavigate } from "react-router";
import { PencilSquareIcon } from "icons/PencilSquareIcon";
import { Prompt16FilledIcon } from "icons/Prompt16FilledIcon";
import { useAppStoreActions } from "store/app/AppStore";

export const SideNavActionButtons = () => {
  const { closeSideNav } = useAppStoreActions();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => () => {
    navigate(path);
    closeSideNav();
  };

  return (
    <div className="flex flex-col gap-2 px-4">
      <button
        className="bg-blue-500 hover:bg-blue-400 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:outline-1 dark:hover:outline-gray-500 text-white py-1.5 rounded flex items-center justify-center gap-2 cursor-pointer"
        aria-label="New conversation"
        type="button"
        onClick={handleNavigation("/chat")}
      >
        <PencilSquareIcon className="inline w-4 h-4" />
        <span className="text-sm">New conversation</span>
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-400 dark:bg-gray-950 dark:hover:bg-gray-950 dark:hover:outline-1 dark:hover:outline-gray-500 text-white py-1.5 rounded flex items-center justify-center gap-2 cursor-pointer"
        aria-label="Prompts"
        type="button"
        onClick={handleNavigation("/prompts")}
      >
        <Prompt16FilledIcon className="inline w-5 h-5" />
        <span className="text-sm">Prompts</span>
      </button>
    </div>
  );
};
