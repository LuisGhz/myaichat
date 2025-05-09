import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { SideNav } from "components/SideNav/SideNav";
import { AppContext } from "context/AppContext";
import { useContext } from "react";

function App() {
  const { isMenuOpen } = useContext(AppContext);

  return (
    <>
      <ToastContainer />
      <div className="flex h-dvh relative">
        <SideNav />
        <main className={`grow bg-cop-3 ms-0 transition-all duration-500 ${isMenuOpen ? "lg:ms-72" : ""}`}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
