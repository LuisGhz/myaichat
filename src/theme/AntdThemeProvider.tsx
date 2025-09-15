import { ConfigProvider } from "antd";

type Props = {
  children: React.ReactNode;
};

export const AntdThemeProvider = ({ children }: Props) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgElevated: "var(--color-gray-950)",
        },
        components: {
          Select: {
            selectorBg: "var(--color-gray-950)",
            colorText: "var(--color-gray-200)",
            optionActiveBg: "var(--color-gray-800)",
            optionSelectedBg: "var(--color-gray-700)",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
