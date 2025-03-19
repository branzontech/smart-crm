
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4 text-teal">404</h1>
          <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
          <p className="text-gray-500 mb-6">
            La ruta <code className="bg-gray-100 px-2 py-1 rounded">{location.pathname}</code> no existe en la aplicación.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full bg-teal hover:bg-sage text-white"
              onClick={() => navigate("/dashboard")}
            >
              Ir al Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-teal text-teal hover:bg-teal/10"
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
