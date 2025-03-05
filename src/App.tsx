
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./App.css";
import "./styles/print.css"; // Import print styles

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Clientes
import Clientes from "./pages/clientes";
import DetalleCliente from "./pages/clientes/[id]";
import NuevoCliente from "./pages/clientes/nuevo";

// Empresas
import Empresas from "./pages/empresas";
import NuevaEmpresa from "./pages/empresas/nuevo";

// Proveedores
import Proveedores from "./pages/proveedores";
import NuevoProveedor from "./pages/proveedores/nuevo";

// Recaudos
import Recaudos from "./pages/recaudos";
import NuevoRecaudo from "./pages/recaudos/nuevo";
import SeguimientoRecaudos from "./pages/recaudos/seguimiento";

// Ventas
import Ventas from "./pages/ventas";
import Oportunidades from "./pages/ventas/oportunidades";
import NuevaOportunidad from "./pages/ventas/oportunidades/nueva";
import Cotizaciones from "./pages/ventas/cotizaciones";
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

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rutas de Clientes */}
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/clientes/:id" element={<DetalleCliente />} />
          
          {/* Rutas de Empresas */}
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/empresas/nuevo" element={<NuevaEmpresa />} />
          
          {/* Rutas de Proveedores */}
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proveedores/nuevo" element={<NuevoProveedor />} />
          
          {/* Rutas de Recaudos */}
          <Route path="/recaudos" element={<Recaudos />} />
          <Route path="/recaudos/nuevo" element={<NuevoRecaudo />} />
          <Route path="/recaudos/seguimiento" element={<SeguimientoRecaudos />} />
          
          {/* Rutas de Ventas */}
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/ventas/oportunidades" element={<Oportunidades />} />
          <Route path="/ventas/oportunidades/nueva" element={<NuevaOportunidad />} />
          <Route path="/ventas/cotizaciones" element={<Cotizaciones />} />
          <Route path="/ventas/cotizaciones/nueva" element={<NuevaCotizacion />} />
          <Route path="/ventas/cotizaciones/nueva-wizard" element={<NuevaCotizacionWizard />} />
          <Route path="/ventas/contratos" element={<Contratos />} />
          <Route path="/ventas/contratos/nuevo" element={<NuevoContrato />} />
          
          {/* Rutas de Reportes */}
          <Route path="/reportes" element={<Reportes />} />
          
          {/* Ruta de Calendario */}
          <Route path="/calendario" element={<Calendario />} />
          
          {/* Ruta de Comunicaciones */}
          <Route path="/comunicaciones" element={<Comunicaciones />} />
          
          {/* Ruta de Configuración */}
          <Route path="/configuracion" element={<Configuracion />} />
          
          {/* Rutas de Cuentas de Cobro (nuevo módulo) */}
          <Route path="/cuentas-cobro" element={<CuentasCobro />} />
          <Route path="/cuentas-cobro/nueva" element={<NuevaCuentaCobro />} />
          
          {/* Ruta para página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}
