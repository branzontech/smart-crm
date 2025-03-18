
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import CuentasCobro from "@/pages/cuentasCobro";
import NuevaCuentaCobro from "@/pages/cuentasCobro/nueva";

const CuentasCobroRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <CuentasCobro />
        </ProtectedRoute>
      } />
      <Route path="/nueva" element={
        <ProtectedRoute>
          <NuevaCuentaCobro />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default CuentasCobroRoutes;
