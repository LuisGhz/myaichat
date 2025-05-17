import App from "App";
import { CurrentChat } from "components/CurrentChat";
import { Prompts } from "features/Prompts/Prompts";
import { PromptsForm } from "features/Prompts/PromptsForm";
import { Welcome } from "components/Welcome/Welcome";
import { BrowserRouter, Routes, Route } from "react-router";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Welcome />}></Route>
          <Route path="chat" element={<CurrentChat />}></Route>
          <Route path="chat/:id" element={<CurrentChat />}></Route>
          <Route path="prompts" element={<Prompts />}></Route>
          <Route path="prompts/form" element={<PromptsForm />}></Route>
          <Route path="prompts/form/:id" element={<PromptsForm />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
