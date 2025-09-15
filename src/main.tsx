import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "AppRouter.tsx";
import { AntdThemeProvider } from "theme/AntdThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntdThemeProvider>
      <AppRouter />
    </AntdThemeProvider>
  </StrictMode>
);
