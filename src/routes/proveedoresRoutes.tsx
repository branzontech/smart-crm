
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Proveedores from "@/pages/proveedores";
import DetalleProveedor from "@/pages/proveedores/[id]";
import EditarProveedor from "@/pages/proveedores/[id]/editar";
import NuevoProveedor from "@/pages/proveedores/nuevo";

const ProveedoresRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Proveedores />
        </ProtectedRoute>
      } />
      <Route path="/nuevo" element={
        <ProtectedRoute>
          <NuevoProveedor />
        </ProtectedRoute>
      } />
      <Route path="/:id" element={
        <ProtectedRoute>
          <DetalleProveedor />
        </ProtectedRoute>
      } />
      <Route path="/:id/editar" element={
        <ProtectedRoute>
          <EditarProveedor />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default ProveedoresRoutes;
