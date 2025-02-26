
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
import VentasIndex from "./pages/ventas/index";
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
          <Route path="/ventas" element={<VentasIndex />} />
          <Route path="/reportes" element={<ReportesIndex />} />
          <Route path="/calendario" element={<CalendarioIndex />} />
          <Route path="/comunicaciones" element={<ComunicacionesIndex />} />
          <Route path="/configuracion" element={<ConfiguracionIndex />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
