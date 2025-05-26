import { useContext } from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { AppContext } from "context/AppContext";
import { SideNav } from "components/SideNav/SideNav";
import { OfflineMessage } from "components/OfflineMessage";

function App() {
  const { isMenuOpen, isOffline } = useContext(AppContext);

  return (
    <>
      <ToastContainer />
      <OfflineMessage />
      <div className={`flex relative ${!isOffline ? "h-dvh" : "h-[calc(100dvh-4rem)]"}`}>
        <SideNav />
        <main
          className={`grow bg-cop-3 ms-0 transition-all duration-500 ${
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
