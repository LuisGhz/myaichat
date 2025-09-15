import { Layout } from "antd";

export const AppHeader = () => {
  const { Header } = Layout;
  return (
    <Header
      className="bg-white shadow-sm flex items-center px-4"
      style={{ height: 32, backgroundColor: "white" }}
    >
      <h1 className="text-lg font-semibold">My AI Chat</h1>
    </Header>
  );
};
