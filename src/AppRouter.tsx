import App from "App";
import { CurrentChat } from "components/CurrentChat";
import { PromptsForm } from "components/Prompts/PromptsForm";
import { Welcome } from "components/Welcome";
import { BrowserRouter, Routes, Route } from "react-router";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Welcome />}></Route>
          <Route path="chat" element={<CurrentChat />}></Route>
          <Route path="chat/:id" element={<CurrentChat />}></Route>
          <Route path="prompts" element={<PromptsForm />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
