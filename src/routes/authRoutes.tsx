
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/login";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  );
};

export default AuthRoutes;
