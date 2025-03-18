
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PersonalizacionIndex from "@/pages/personalizacion";
import PersonalizacionTemas from "@/pages/personalizacion/temas";

const PersonalizacionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <PersonalizacionIndex />
        </ProtectedRoute>
      } />
      <Route path="/temas" element={
        <ProtectedRoute>
          <PersonalizacionTemas />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default PersonalizacionRoutes;
