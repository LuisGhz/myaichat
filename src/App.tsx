import { Layout } from "antd";
import { SideNav } from "components/sidenav/SideNav";
import { Outlet } from "react-router";
import { useAppStore, useAppStoreActions } from "store/app/AppStore";

const { Content, Header } = Layout;

function App() {
  const { sideNavCollapsed } = useAppStore();
  const { setSideNavCollapsed } = useAppStoreActions();
  return (
    <Layout className="h-dvh">
      <SideNav />
      <Layout>
        <Header className="bg-white shadow-sm flex items-center px-4">
          <h1 className="text-lg font-semibold">My AI Chat</h1>
          <button onClick={() => setSideNavCollapsed(!sideNavCollapsed)}>
            Toggle SideNav
          </button>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
