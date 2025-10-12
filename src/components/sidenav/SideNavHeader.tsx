import { Link } from "react-router";
import { MenuFoldLeftIcon } from "icons/MenuFoldLeftIcon";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";
import myaichatlogo from "assets/myaichat.png";

export const SideNavHeader = () => {
  const { sideNavCollapsed } = useAppStore();
  const { setSideNavCollapsed } = useAppStoreActions();

  const handleToggle = () => {
    setSideNavCollapsed(!sideNavCollapsed);
  };

  return (
    <div className="flex justify-between items-center p-2.5">
      <Link to="/">
        <img
          className="w-8 h-8 xl:w-8 xl:h-8 rounded-full"
          src={myaichatlogo}
          alt="MyAIChatlogo"
        />
      </Link>
      <button onClick={handleToggle}>
        <MenuFoldLeftIcon
          className={`w-7 h-7 xl:w-8 xl:h-8 transition-transform dark:text-white cursor-pointer`}
        />
      </button>
    </div>
  );
};
