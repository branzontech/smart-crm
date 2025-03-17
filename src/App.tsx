import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import DashboardPage from './pages/dashboard';
import RequireAuth from './components/auth/RequireAuth';
import CompanyConfigPage from './pages/configuracion/company-config';
import ProductosPage from './pages/productos';
import NuevaCotizacionPage from './pages/ventas/cotizaciones/nueva-cotizacion';
import CotizacionesPage from './pages/ventas/cotizaciones';
import ClientesPage from './pages/clientes';
import NuevaClientePage from './pages/clientes/nuevo-cliente';
import EditClientePage from './pages/clientes/editar-cliente';
import { Toaster } from '@/components/ui/sonner';
import CotizacionDetailPage from './pages/ventas/cotizaciones/[id]';

// Update routes array to include the new route
const routes = [
  {
    path: "/",
    element: <RequireAuth><DashboardPage /></RequireAuth>,
  },
  {
    path: "/configuracion/empresa",
    element: <RequireAuth><CompanyConfigPage /></RequireAuth>,
  },
  {
    path: "/productos",
    element: <RequireAuth><ProductosPage /></RequireAuth>,
  },
  {
    path: "/ventas/cotizaciones",
    element: <RequireAuth><CotizacionesPage /></RequireAuth>,
  },
  {
    path: "/ventas/cotizaciones/nueva-cotizacion",
    element: <RequireAuth><NuevaCotizacionPage /></RequireAuth>,
  },
  {
    path: "/clientes",
    element: <RequireAuth><ClientesPage /></RequireAuth>,
  },
  {
    path: "/clientes/nuevo-cliente",
    element: <RequireAuth><NuevaClientePage /></RequireAuth>,
  },
  {
    path: "/clientes/editar-cliente/:id",
    element: <RequireAuth><EditClientePage /></RequireAuth>,
  },
  {
    path: "ventas/cotizaciones/:id",
    element: <RequireAuth><CotizacionDetailPage /></RequireAuth>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          {/* Redirect to dashboard if no route matches */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
