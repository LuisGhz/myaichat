import App from "App";
import { Login } from "features/Auth/pages/Login";
import { Chat } from "features/Chat/pages/Chat";
import { CreateEditPrompt } from "features/Prompts/pages/CreateEditPromtp";
import { Prompts } from "features/Prompts/pages/Prompts";
import { Welcome } from "features/Welcome/Welcome";
import { BrowserRouter, Route, Routes } from "react-router";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route index element={<Welcome />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="prompts/form" element={<CreateEditPrompt />} />
          <Route path="prompts/form/:id" element={<CreateEditPrompt />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
