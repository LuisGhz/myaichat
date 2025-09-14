import { Layout } from "antd";

const { Sider } = Layout;

export const SideNav = () => {
  return (
    <Sider width={"25%"}>
      <p className="dark:text-white">SideNav</p>
    </Sider>
  );
};
