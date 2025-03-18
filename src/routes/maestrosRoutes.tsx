
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import MaestrosIndex from "@/pages/maestros";
import Sectores from "@/pages/maestros/sectores";
import TiposServicios from "@/pages/maestros/tiposServicios";
import Paises from "@/pages/maestros/paises";
import Ciudades from "@/pages/maestros/ciudades";
import OrigenesCliente from "@/pages/maestros/origenesCliente";
import TiposProductos from "@/pages/maestros/tiposProductos";

const MaestrosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <MaestrosIndex />
        </ProtectedRoute>
      } />
      <Route path="/sectores" element={
        <ProtectedRoute>
          <Sectores />
        </ProtectedRoute>
      } />
      <Route path="/tipos-servicios" element={
        <ProtectedRoute>
          <TiposServicios />
        </ProtectedRoute>
      } />
      <Route path="/paises" element={
        <ProtectedRoute>
          <Paises />
        </ProtectedRoute>
      } />
      <Route path="/ciudades" element={
        <ProtectedRoute>
          <Ciudades />
        </ProtectedRoute>
      } />
      <Route path="/origenes-cliente" element={
        <ProtectedRoute>
          <OrigenesCliente />
        </ProtectedRoute>
      } />
      <Route path="/tipos-productos" element={
        <ProtectedRoute>
          <TiposProductos />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default MaestrosRoutes;
