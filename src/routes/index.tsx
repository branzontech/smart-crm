
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import route groups
import AuthRoutes from "./authRoutes";
import ClientesRoutes from "./clientesRoutes";
import EmpresasRoutes from "./empresasRoutes";
import ProveedoresRoutes from "./proveedoresRoutes";
import RecaudosRoutes from "./recaudosRoutes";
import VentasRoutes from "./ventasRoutes";
import MaestrosRoutes from "./maestrosRoutes";
import CuentasCobroRoutes from "./cuentasCobroRoutes";
import PersonalizacionRoutes from "./personalizacionRoutes";
import ConfiguracionRoutes from "./configuracionRoutes";

// Import standalone pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Reportes from "@/pages/reportes";
import Calendario from "@/pages/calendario";
import Comunicaciones from "@/pages/comunicaciones";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redireccionar la ruta raíz a la página de login */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      
      {/* Authentication routes */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      
      {/* Dashboard - Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      
      {/* Section routes */}
      <Route path="/clientes/*" element={<ClientesRoutes />} />
      <Route path="/empresas/*" element={<EmpresasRoutes />} />
      <Route path="/proveedores/*" element={<ProveedoresRoutes />} />
      <Route path="/recaudos/*" element={<RecaudosRoutes />} />
      <Route path="/ventas/*" element={<VentasRoutes />} />
      <Route path="/maestros/*" element={<MaestrosRoutes />} />
      <Route path="/cuentas-cobro/*" element={<CuentasCobroRoutes />} />
      <Route path="/personalizacion/*" element={<PersonalizacionRoutes />} />
      <Route path="/configuracion/*" element={<ConfiguracionRoutes />} />
      
      {/* Standalone pages - Protected */}
      <Route path="/reportes" element={
        <ProtectedRoute>
          <Reportes />
        </ProtectedRoute>
      } />
      
      <Route path="/calendario" element={
        <ProtectedRoute>
          <Calendario />
        </ProtectedRoute>
      } />
      
      <Route path="/comunicaciones" element={
        <ProtectedRoute>
          <Comunicaciones />
        </ProtectedRoute>
      } />
      
      {/* Not Found page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
