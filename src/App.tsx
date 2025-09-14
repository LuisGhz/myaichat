import { Layout } from "antd";
import { SideNav } from "components/SideNav";

const { Content } = Layout;

function App() {
  return (
    <Layout className="h-dvh">
      <SideNav />
      <Layout>
        <Content>
          <p>Content</p>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
