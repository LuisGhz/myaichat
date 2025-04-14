import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { SideNav } from "components/SideNav/SideNav";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="flex h-full relative">
        <SideNav />
        <main className="grow bg-cop-3">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
