import { Layout } from "antd";
import { MenuFoldRight } from "icons/MenuFoldRightIcon";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

export const AppHeader = () => {
  const { sideNavCollapsed } = useAppStore();
  const { setSideNavCollapsed } = useAppStoreActions();
  const { Header } = Layout;
  return (
    <Header className="app-bg shadow-sm flex items-center !px-1 h-9">
      {sideNavCollapsed ? (
        <button
          className="me-2"
          onClick={() => setSideNavCollapsed(!sideNavCollapsed)}
          aria-label="Expand side navigation"
        >
          <MenuFoldRight className="w-7 h-7 text-gray-600 dark:text-gray-300 cursor-pointer" />
        </button>
      ) : null}
      <h1 className="text-2xl font-semibold app-text">My AI Chat</h1>
    </Header>
  );
};
