import { ConfigProvider, ThemeConfig } from "antd";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const darkTheme: ThemeConfig = {
  components: {
    Select: {
      selectorBg: "var(--color-woodsmoke-800)",
      colorText: "var(--color-gray-200)",
      optionActiveBg: "var(--color-woodsmoke-950)",
      optionSelectedBg: "var(--color-woodsmoke-700)",
      colorBgElevated: "var(--color-woodsmoke-800)",
      colorTextPlaceholder: "var(--color-woodsmoke-200)",
    },
    Input: {
      colorText: "var(--color-woodsmoke-200)",
      colorTextPlaceholder: "var(--color-woodsmoke-400)",
      colorBgContainer: "var(--color-woodsmoke-800)",
    },
    Skeleton: {
      gradientFromColor: "rgba(0,0,0,0.2)",
      gradientToColor: "rgba(0,0,0,0.45)",
    },
    Button: {
      colorText: "var(--color-gray-200)",
      colorBgContainer: "var(--color-woodsmoke-800)",
      colorBorder: "var(--color-woodsmoke-600)",
      defaultHoverColor: "var(--color-woodsmoke-100)",
      defaultHoverBorderColor: "var(--color-woodsmoke-400)",
    },
    Message: {
      colorText: "var(--color-woodsmoke-200)",
      contentBg: "var(--color-woodsmoke-900)",
      boxShadow:
        "0 6px 16px 0 rgba(255, 255, 255, 0.08), 0 3px 6px -4px rgba(255, 255, 255, 0.12), 0 9px 28px 8px rgba(255, 255, 255, 0.05)",
    },
  },
};

const lightTheme: ThemeConfig = {
  components: {
    Select: {
      colorText: "var(--color-gray-700)",
    },
  },
};

export const AntdThemeProvider = ({ children }: Props) => {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(mediaQuery.matches ? "dark" : "light");
    const handleChange = (e: MediaQueryListEvent) => {
      const newColorScheme = e.matches ? "dark" : "light";
      setColorScheme(newColorScheme);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ConfigProvider theme={colorScheme === "dark" ? darkTheme : lightTheme}>
      {children}
    </ConfigProvider>
  );
};
