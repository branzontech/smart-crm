
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Ventas from "@/pages/ventas";
import Oportunidades from "@/pages/ventas/oportunidades";
import DetalleOportunidad from "@/pages/ventas/oportunidades/[id]";
import NuevaOportunidad from "@/pages/ventas/oportunidades/nueva";
import Cotizaciones from "@/pages/ventas/cotizaciones";
import CotizacionDetalle from "@/pages/ventas/cotizaciones/[id]";
import NuevaCotizacion from "@/pages/ventas/cotizaciones/nueva";
import NuevaCotizacionWizard from "@/pages/ventas/cotizaciones/nueva-cotizacion";
import Contratos from "@/pages/ventas/contratos";
import NuevoContrato from "@/pages/ventas/contratos/nuevo";

const VentasRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Ventas />
        </ProtectedRoute>
      } />
      
      {/* Oportunidades */}
      <Route path="/oportunidades" element={
        <ProtectedRoute>
          <Oportunidades />
        </ProtectedRoute>
      } />
      <Route path="/oportunidades/:id" element={
        <ProtectedRoute>
          <DetalleOportunidad />
        </ProtectedRoute>
      } />
      <Route path="/oportunidades/nueva" element={
        <ProtectedRoute>
          <NuevaOportunidad />
        </ProtectedRoute>
      } />
      
      {/* Cotizaciones */}
      <Route path="/cotizaciones" element={
        <ProtectedRoute>
          <Cotizaciones />
        </ProtectedRoute>
      } />
      <Route path="/cotizaciones/:id" element={
        <ProtectedRoute>
          <CotizacionDetalle />
        </ProtectedRoute>
      } />
      <Route path="/cotizaciones/nueva" element={
        <ProtectedRoute>
          <NuevaCotizacion />
        </ProtectedRoute>
      } />
      <Route path="/cotizaciones/nueva-wizard" element={
        <ProtectedRoute>
          <NuevaCotizacionWizard />
        </ProtectedRoute>
      } />
      
      {/* Contratos */}
      <Route path="/contratos" element={
        <ProtectedRoute>
          <Contratos />
        </ProtectedRoute>
      } />
      <Route path="/contratos/nuevo" element={
        <ProtectedRoute>
          <NuevoContrato />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default VentasRoutes;
