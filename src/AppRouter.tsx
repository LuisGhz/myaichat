import App from "App";
import { ProtectedRoute } from "components/ProtectedRoute";
import { Login } from "features/Auth/pages/Login";
import { OAuth2Callback } from "features/Auth/pages/OAuth2Callback";
import { useChatParams } from "features/Chat/hooks/useChatParams";
import { Chat } from "features/Chat/pages/Chat";
import { CreateEditPrompt } from "features/Prompts/pages/CreateEditPrompt";
import { Prompts } from "features/Prompts/pages/Prompts";
import { Welcome } from "features/Welcome/pages/Welcome";
import { BrowserRouter, Route, Routes } from "react-router";

const ChatWithMessages = () => {
  const params = useChatParams();
  return <Chat key={params.id} />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/callback" element={<OAuth2Callback />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          <Route index element={<Welcome />} />
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:id" element={<ChatWithMessages />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="prompts/form" element={<CreateEditPrompt />} />
          <Route path="prompts/form/:id" element={<CreateEditPrompt />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
