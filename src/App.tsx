import { Outlet } from "react-router";
import { ChatsList } from "components/ChatsList";

function App() {
  return (
    <div className="flex h-full relative">
      <ChatsList />
      <main className="grow bg-cop-3">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
