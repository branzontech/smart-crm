
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NuevoCliente from "./pages/clientes/nuevo";
import ClientesIndex from "./pages/clientes/index";
import EmpresasIndex from "./pages/empresas/index";
import NuevaEmpresa from "./pages/empresas/nuevo";
import ProveedoresIndex from "./pages/proveedores/index";
import NuevoProveedor from "./pages/proveedores/nuevo";
import RecaudosIndex from "./pages/recaudos/index";
import NuevoRecaudo from "./pages/recaudos/nuevo";
import SeguimientoRecaudos from "./pages/recaudos/seguimiento";
import VentasIndex from "./pages/ventas/index";
import OportunidadesIndex from "./pages/ventas/oportunidades/index";
import NuevaOportunidad from "./pages/ventas/oportunidades/nueva";
import CotizacionesIndex from "./pages/ventas/cotizaciones/index";
import NuevaCotizacion from "./pages/ventas/cotizaciones/nueva";
import ContratosIndex from "./pages/ventas/contratos/index";
import ReportesIndex from "./pages/reportes/index";
import CalendarioIndex from "./pages/calendario/index";
import ComunicacionesIndex from "./pages/comunicaciones/index";
import ConfiguracionIndex from "./pages/configuracion/index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clientes" element={<ClientesIndex />} />
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/empresas" element={<EmpresasIndex />} />
          <Route path="/empresas/nuevo" element={<NuevaEmpresa />} />
          <Route path="/proveedores" element={<ProveedoresIndex />} />
          <Route path="/proveedores/nuevo" element={<NuevoProveedor />} />
          <Route path="/recaudos" element={<RecaudosIndex />} />
          <Route path="/recaudos/nuevo" element={<NuevoRecaudo />} />
          <Route path="/recaudos/seguimiento" element={<SeguimientoRecaudos />} />
          <Route path="/ventas" element={<VentasIndex />} />
          <Route path="/ventas/oportunidades" element={<OportunidadesIndex />} />
          <Route path="/ventas/oportunidades/nueva" element={<NuevaOportunidad />} />
          <Route path="/ventas/cotizaciones" element={<CotizacionesIndex />} />
          <Route path="/ventas/cotizaciones/nueva" element={<NuevaCotizacion />} />
          <Route path="/ventas/contratos" element={<ContratosIndex />} />
          <Route path="/reportes" element={<ReportesIndex />} />
          <Route path="/calendario" element={<CalendarioIndex />} />
          <Route path="/comunicaciones" element={<ComunicacionesIndex />} />
          <Route path="/configuracion" element={<ConfiguracionIndex />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
