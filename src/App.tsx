import { useEffect } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { SideNav } from "components/SideNav/SideNav";
import { OfflineMessage } from "components/OfflineMessage";
import {
  useAppIsMenuOpenStore,
  useAppUpdateIsOfflineStore,
} from "store/useAppStore";
import { useNetworkState } from "hooks/useNetworkState";

function App() {
  const isMenuOpen = useAppIsMenuOpenStore();
  const updateIsOffline = useAppUpdateIsOfflineStore();
  const { isOffline } = useNetworkState();

  useEffect(() => {
    updateIsOffline(isOffline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline]);

  return (
    <>
      <ToastContainer />
      <OfflineMessage />
      <div
        className={`flex relative ${
          !isOffline ? "h-dvh" : "h-[calc(100dvh-4rem)]"
        }`}
      >
        <SideNav />
        <main
          className={`app-main grow bg-cop-3 ms-0 transition-all duration-500 overflow-y-auto ${
            isMenuOpen ? "lg:ms-72" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
