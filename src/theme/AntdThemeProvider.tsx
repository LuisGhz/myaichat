import { ConfigProvider, ThemeConfig } from "antd";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

const darkTheme: ThemeConfig = {
  components: {
    Select: {
      selectorBg: "var(--color-gray-950)",
      colorText: "var(--color-gray-200)",
      optionActiveBg: "var(--color-gray-800)",
      optionSelectedBg: "var(--color-gray-700)",
      colorBgElevated: "var(--color-gray-950)",
      colorTextPlaceholder: "var(--color-gray-200)",
    },
    Input: {
      colorText: "var(--color-gray-200)",
      colorTextPlaceholder: "var(--color-gray-400)",
      colorBgContainer: "var(--color-gray-950)",
    },
    Skeleton: {
      gradientFromColor: "rgba(0,0,0,0.2)",
      gradientToColor: "rgba(0,0,0,0.45)",
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
