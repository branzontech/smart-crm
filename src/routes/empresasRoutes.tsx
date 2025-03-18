
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Empresas from "@/pages/empresas";
import DetalleEmpresa from "@/pages/empresas/[id]";
import EditarEmpresa from "@/pages/empresas/[id]/editar";
import NuevaEmpresa from "@/pages/empresas/nuevo";

const EmpresasRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Empresas />
        </ProtectedRoute>
      } />
      <Route path="/nuevo" element={
        <ProtectedRoute>
          <NuevaEmpresa />
        </ProtectedRoute>
      } />
      <Route path="/:id" element={
        <ProtectedRoute>
          <DetalleEmpresa />
        </ProtectedRoute>
      } />
      <Route path="/:id/editar" element={
        <ProtectedRoute>
          <EditarEmpresa />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default EmpresasRoutes;
