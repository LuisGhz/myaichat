import { Layout } from "antd";
import { AppHeader } from "components/header/AppHeader";
import { SideNav } from "components/sidenav/SideNav";
import { Outlet } from "react-router";

const { Content } = Layout;

function App() {
  return (
    <Layout className="h-dvh">
      <SideNav />
      <Layout>
        <AppHeader />
        <Content className="!bg-gray-100 dark:!bg-gray-900">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
