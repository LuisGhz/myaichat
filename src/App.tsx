import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { ChatsList } from "components/ChatsList";

function App() {
  return (
    <>
      <ToastContainer />
      <div className="flex h-full relative">
        <ChatsList />
        <main className="grow bg-cop-3">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
