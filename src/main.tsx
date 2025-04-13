import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppContextProvider } from "context/AppContextProvider.tsx";
import { AppRouter } from "AppRouter.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <AppRouter />
    </AppContextProvider>
  </StrictMode>
);
