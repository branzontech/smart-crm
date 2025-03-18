
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PersonalizacionIndex from "@/pages/personalizacion";

const PersonalizacionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <PersonalizacionIndex />
        </ProtectedRoute>
      } />
      {/* Add temas route here if needed */}
    </Routes>
  );
};

export default PersonalizacionRoutes;
