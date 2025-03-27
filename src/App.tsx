import { Outlet } from "react-router"
import { ChatsList } from "components/ChatsList"

function App() {

  return (
    <div className="flex">
      <div className="w-2xs">
        <ChatsList />
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
