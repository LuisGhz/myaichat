import { Layout } from "antd";
import { MenuFoldRight } from "icons/MenuFoldRightIcon";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const AppHeader = () => {
  const { sideNavCollapsed } = useAppStore();
  const { setSideNavCollapsed } = useAppStoreActions();
  const { Header } = Layout;
  return (
    <Header
      className="!bg-gray-100 dark:!bg-gray-900 shadow-sm flex items-center !px-1"
      style={{ height: 32 }}
    >
      {sideNavCollapsed ? (
        <button
          className="me-2"
          onClick={() => setSideNavCollapsed(!sideNavCollapsed)}
          aria-label="Expand side navigation"
        >
          <MenuFoldRight className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer" />
        </button>
      ) : null}
      <h1 className="text-lg font-semibold dark:text-white">My AI Chat</h1>
    </Header>
  );
};
