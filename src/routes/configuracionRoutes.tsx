
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import ConfiguracionIndex from "@/pages/configuracion";
import ConfiguracionUsuarios from "@/pages/configuracion/usuarios";

const ConfiguracionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <ConfiguracionIndex />
        </ProtectedRoute>
      } />
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <ConfiguracionUsuarios />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default ConfiguracionRoutes;
