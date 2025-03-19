
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

export const CotizacionEmpty = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto text-center py-16">
        <h2 className="text-2xl font-bold mb-4">No se encontró la cotización</h2>
        <Button onClick={() => navigate("/ventas/cotizaciones")}>
          Volver a cotizaciones
        </Button>
      </div>
    </Layout>
  );
};
