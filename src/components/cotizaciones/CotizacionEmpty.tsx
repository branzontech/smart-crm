
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { useNavigate } from "react-router-dom";

export const CotizacionEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No se encontró la cotización</h2>
        <Button onClick={() => navigate("/ventas/cotizaciones")}>
          Volver a cotizaciones
        </Button>
      </div>
    </Layout>
  );
};
