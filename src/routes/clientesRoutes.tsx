
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Clientes from "@/pages/clientes";
import DetalleCliente from "@/pages/clientes/[id]";
import NuevoCliente from "@/pages/clientes/nuevo";
import EditarCliente from "@/pages/clientes/[id]/editar";

const ClientesRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Clientes />
        </ProtectedRoute>
      } />
      <Route path="/nuevo" element={
        <ProtectedRoute>
          <NuevoCliente />
        </ProtectedRoute>
      } />
      <Route path="/:id" element={
        <ProtectedRoute>
          <DetalleCliente />
        </ProtectedRoute>
      } />
      <Route path="/:id/editar" element={
        <ProtectedRoute>
          <EditarCliente />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default ClientesRoutes;
