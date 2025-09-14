import { Login } from "features/Auth/pages/Login";
import { BrowserRouter, Route, Routes } from "react-router";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
