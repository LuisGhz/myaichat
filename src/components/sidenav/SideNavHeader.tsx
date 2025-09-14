import { MenuFoldLeftIcon } from "icons/MenuFoldLeftIcon";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const SideNavHeader = () => {
  const { sideNavCollapsed } = useAppStore();
  const { setSideNavCollapsed } = useAppStoreActions();

  const handleToggle = () => {
    setSideNavCollapsed(!sideNavCollapsed);
  };

  return (
    <div className="flex justify-between items-center p-2.5">
      <div className="w-8 h-8 xl:w-8 xl:h-8 bg-blue-600 rounded-full"></div>
      <button onClick={handleToggle}>
        <MenuFoldLeftIcon
          className={`w-6 h-6 xl:w-8 xl:h-8 transition-transform dark:text-white cursor-pointer`}
        />
      </button>
    </div>
  );
};
