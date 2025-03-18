
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Recaudos from "@/pages/recaudos";
import NuevoRecaudo from "@/pages/recaudos/nuevo";
import SeguimientoRecaudos from "@/pages/recaudos/seguimiento";

const RecaudosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Recaudos />
        </ProtectedRoute>
      } />
      <Route path="/nuevo" element={
        <ProtectedRoute>
          <NuevoRecaudo />
        </ProtectedRoute>
      } />
      <Route path="/seguimiento" element={
        <ProtectedRoute>
          <SeguimientoRecaudos />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/recaudos" replace />} />
    </Routes>
  );
};

export default RecaudosRoutes;
