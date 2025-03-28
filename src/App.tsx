import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import "./App.css";
import "./styles/print.css"; // Import print styles

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/login";

// Clientes
import Clientes from "./pages/clientes";
import DetalleCliente from "./pages/clientes/[id]";
import NuevoCliente from "./pages/clientes/nuevo";
import EditarCliente from "./pages/clientes/[id]/editar"; // New import

// Empresas
import Empresas from "./pages/empresas";
import DetalleEmpresa from "./pages/empresas/[id]";
import EditarEmpresa from "./pages/empresas/[id]/editar";
import NuevaEmpresa from "./pages/empresas/nuevo";

// Proveedores
import Proveedores from "./pages/proveedores";
import DetalleProveedor from "./pages/proveedores/[id]";
import EditarProveedor from "./pages/proveedores/[id]/editar";
import NuevoProveedor from "./pages/proveedores/nuevo";

// Recaudos
import Recaudos from "./pages/recaudos";
import NuevoRecaudo from "./pages/recaudos/nuevo";
import SeguimientoRecaudos from "./pages/recaudos/seguimiento";

// Ventas
import Ventas from "./pages/ventas";
import Oportunidades from "./pages/ventas/oportunidades";
import DetalleOportunidad from "./pages/ventas/oportunidades/[id]"; // New import
import NuevaOportunidad from "./pages/ventas/oportunidades/nueva";
import Cotizaciones from "./pages/ventas/cotizaciones";
import CotizacionDetalle from "./pages/ventas/cotizaciones/[id]";
import NuevaCotizacion from "./pages/ventas/cotizaciones/nueva";
import NuevaCotizacionWizard from "./pages/ventas/cotizaciones/nueva-cotizacion";
import Contratos from "./pages/ventas/contratos";
import NuevoContrato from "./pages/ventas/contratos/nuevo";

// Reportes
import Reportes from "./pages/reportes";

// Calendario
import Calendario from "./pages/calendario";

// Comunicaciones
import Comunicaciones from "./pages/comunicaciones";

// Configuración
import Configuracion from "./pages/configuracion";

// Cuentas de Cobro (nuevo módulo)
import CuentasCobro from "./pages/cuentasCobro";
import NuevaCuentaCobro from "./pages/cuentasCobro/nueva";

// Datos Maestros (nuevo módulo)
import MaestrosIndex from "./pages/maestros";
import Sectores from "./pages/maestros/sectores";
import TiposServicios from "./pages/maestros/tiposServicios";
import Paises from "./pages/maestros/paises";
import Ciudades from "./pages/maestros/ciudades";
import OrigenesCliente from "./pages/maestros/origenesCliente";
import TiposProductos from "./pages/maestros/tiposProductos";

// Add the new import for Usuarios page
import Usuarios from "./pages/usuarios";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Redireccionar la ruta raíz a la página de login */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            
            {/* Rutas de Autenticación */}
            <Route path="/auth/login" element={<Login />} />
            
            {/* Ruta del Dashboard - Protegida */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Clientes - Protegidas */}
            <Route path="/clientes" element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            } />
            <Route path="/clientes/nuevo" element={
              <ProtectedRoute>
                <NuevoCliente />
              </ProtectedRoute>
            } />
            <Route path="/clientes/:id" element={
              <ProtectedRoute>
                <DetalleCliente />
              </ProtectedRoute>
            } />
            {/* Nueva ruta para editar cliente */}
            <Route path="/clientes/:id/editar" element={
              <ProtectedRoute>
                <EditarCliente />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Empresas - Protegidas */}
            <Route path="/empresas" element={
              <ProtectedRoute>
                <Empresas />
              </ProtectedRoute>
            } />
            <Route path="/empresas/nuevo" element={
              <ProtectedRoute>
                <NuevaEmpresa />
              </ProtectedRoute>
            } />
            <Route path="/empresas/:id" element={
              <ProtectedRoute>
                <DetalleEmpresa />
              </ProtectedRoute>
            } />
            <Route path="/empresas/:id/editar" element={
              <ProtectedRoute>
                <EditarEmpresa />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Proveedores - Protegidas */}
            <Route path="/proveedores" element={
              <ProtectedRoute>
                <Proveedores />
              </ProtectedRoute>
            } />
            <Route path="/proveedores/nuevo" element={
              <ProtectedRoute>
                <NuevoProveedor />
              </ProtectedRoute>
            } />
            <Route path="/proveedores/:id" element={
              <ProtectedRoute>
                <DetalleProveedor />
              </ProtectedRoute>
            } />
            <Route path="/proveedores/:id/editar" element={
              <ProtectedRoute>
                <EditarProveedor />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Recaudos - Protegidas */}
            <Route path="/recaudos" element={
              <ProtectedRoute>
                <Recaudos />
              </ProtectedRoute>
            } />
            <Route path="/recaudos/nuevo" element={
              <ProtectedRoute>
                <NuevoRecaudo />
              </ProtectedRoute>
            } />
            <Route path="/recaudos/seguimiento" element={
              <ProtectedRoute>
                <SeguimientoRecaudos />
              </ProtectedRoute>
            } />
            <Route path="/recaudos/*" element={<Navigate to="/recaudos" replace />} />
            
            {/* Rutas de Ventas - Protegidas */}
            <Route path="/ventas" element={
              <ProtectedRoute>
                <Ventas />
              </ProtectedRoute>
            } />
            <Route path="/ventas/oportunidades" element={
              <ProtectedRoute>
                <Oportunidades />
              </ProtectedRoute>
            } />
            {/* Nueva ruta para vista detalle de oportunidad */}
            <Route path="/ventas/oportunidades/:id" element={
              <ProtectedRoute>
                <DetalleOportunidad />
              </ProtectedRoute>
            } />
            <Route path="/ventas/oportunidades/nueva" element={
              <ProtectedRoute>
                <NuevaOportunidad />
              </ProtectedRoute>
            } />
            <Route path="/ventas/cotizaciones" element={
              <ProtectedRoute>
                <Cotizaciones />
              </ProtectedRoute>
            } />
            <Route path="/ventas/cotizaciones/:id" element={
              <ProtectedRoute>
                <CotizacionDetalle />
              </ProtectedRoute>
            } />
            <Route path="/ventas/cotizaciones/nueva" element={
              <ProtectedRoute>
                <NuevaCotizacion />
              </ProtectedRoute>
            } />
            <Route path="/ventas/cotizaciones/nueva-wizard" element={
              <ProtectedRoute>
                <NuevaCotizacionWizard />
              </ProtectedRoute>
            } />
            <Route path="/ventas/contratos" element={
              <ProtectedRoute>
                <Contratos />
              </ProtectedRoute>
            } />
            <Route path="/ventas/contratos/nuevo" element={
              <ProtectedRoute>
                <NuevoContrato />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Reportes - Protegidas */}
            <Route path="/reportes" element={
              <ProtectedRoute>
                <Reportes />
              </ProtectedRoute>
            } />
            
            {/* Ruta de Calendario - Protegida */}
            <Route path="/calendario" element={
              <ProtectedRoute>
                <Calendario />
              </ProtectedRoute>
            } />
            
            {/* Ruta de Comunicaciones - Protegida */}
            <Route path="/comunicaciones" element={
              <ProtectedRoute>
                <Comunicaciones />
              </ProtectedRoute>
            } />
            
            {/* Ruta de Configuración - Protegida */}
            <Route path="/configuracion" element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Cuentas de Cobro - Protegidas */}
            <Route path="/cuentas-cobro" element={
              <ProtectedRoute>
                <CuentasCobro />
              </ProtectedRoute>
            } />
            <Route path="/cuentas-cobro/nueva" element={
              <ProtectedRoute>
                <NuevaCuentaCobro />
              </ProtectedRoute>
            } />
            
            {/* Rutas de Datos Maestros - Protegidas */}
            <Route path="/maestros" element={
              <ProtectedRoute>
                <MaestrosIndex />
              </ProtectedRoute>
            } />
            <Route path="/maestros/sectores" element={
              <ProtectedRoute>
                <Sectores />
              </ProtectedRoute>
            } />
            <Route path="/maestros/tipos-servicios" element={
              <ProtectedRoute>
                <TiposServicios />
              </ProtectedRoute>
            } />
            <Route path="/maestros/paises" element={
              <ProtectedRoute>
                <Paises />
              </ProtectedRoute>
            } />
            <Route path="/maestros/ciudades" element={
              <ProtectedRoute>
                <Ciudades />
              </ProtectedRoute>
            } />
            <Route path="/maestros/origenes-cliente" element={
              <ProtectedRoute>
                <OrigenesCliente />
              </ProtectedRoute>
            } />
            <Route path="/maestros/tipos-productos" element={
              <ProtectedRoute>
                <TiposProductos />
              </ProtectedRoute>
            } />
            
            {/* Add the new route for user management */}
            <Route path="/usuarios" element={
              <ProtectedRoute>
                <Usuarios />
              </ProtectedRoute>
            } />
            
            {/* Ruta para página no encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

