import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
