import App from "App";
import { CurrentChat } from "features/Chat/CurrentChat";
import { Prompts } from "features/Prompts/Prompts";
import { PromptsForm } from "features/Prompts/PromptsForm";
import { Welcome } from "features/Welcome/Welcome";
import { Login, OAuth2Callback, SimpleProtectedRoute } from "features/Auth";
import { BrowserRouter, Routes, Route, useParams } from "react-router";

const CurrentChatWithKey = () => {
  const params = useParams<{ id?: string }>();
  return <CurrentChat key={params.id || "new"} />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/success" element={<OAuth2Callback />} />
        
        {/* Protected routes */}
        <Route element={<SimpleProtectedRoute><App /></SimpleProtectedRoute>}>
          <Route index element={<Welcome />}></Route>
          <Route path="chat" element={<CurrentChatWithKey />}></Route>
          <Route path="chat/:id" element={<CurrentChatWithKey />}></Route>
          <Route path="prompts" element={<Prompts />}></Route>
          <Route path="prompts/form" element={<PromptsForm />}></Route>
          <Route path="prompts/form/:id" element={<PromptsForm />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
