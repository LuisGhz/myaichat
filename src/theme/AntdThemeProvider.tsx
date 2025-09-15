import { ConfigProvider, ThemeConfig } from "antd";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const darkTheme: ThemeConfig = {
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
};

const lightTheme: ThemeConfig = {};

export const AntdThemeProvider = ({ children }: Props) => {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(mediaQuery.matches ? "dark" : "light");
    const handleChange = (e: MediaQueryListEvent) => {
      const newColorScheme = e.matches ? "dark" : "light";
      console.log("System preference changed:", newColorScheme);
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
