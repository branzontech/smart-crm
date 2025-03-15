
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, Edit, Loader2 } from "lucide-react";
import { fetchEmpresaById, Empresa } from "@/services/empresaService";
import { toast } from "sonner";

export default function DetalleEmpresa() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarEmpresa = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchEmpresaById(id);
        if (!data) {
          navigate("/empresas");
          return;
        }
        setEmpresa(data);
      } catch (error: any) {
        toast.error(`Error al cargar la empresa: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    cargarEmpresa();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navbar />
        <div className="main-container">
          <Header />
          <main className="content-container overflow-y-auto">
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-teal" />
              <span className="ml-2">Cargando datos de la empresa...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!empresa) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navbar />
        <div className="main-container">
          <Header />
          <main className="content-container overflow-y-auto">
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Empresa no encontrada</h2>
                <Button 
                  onClick={() => navigate("/empresas")}
                  className="bg-teal hover:bg-sage text-white"
                >
                  Volver al listado
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container overflow-y-auto">
          <div className="max-w-content">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
                onClick={() => navigate("/empresas")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl font-semibold">{empresa.nombre}</CardTitle>
                </div>
                <Button 
                  onClick={() => navigate(`/empresas/${empresa.id}/editar`)}
                  className="bg-teal hover:bg-sage text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Industria</h3>
                    <p className="text-lg text-gray-800">{empresa.industria_nombre || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Empleados</h3>
                    <p className="text-lg text-gray-800">{empresa.empleados}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ciudad</h3>
                    <p className="text-lg text-gray-800">{empresa.ciudad_nombre || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                    <p className="text-lg text-gray-800">{empresa.direccion}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                    <p className="text-lg text-gray-800">{empresa.telefono}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Sitio Web</h3>
                    <p className="text-lg text-gray-800">
                      {empresa.sitio_web ? (
                        <a 
                          href={empresa.sitio_web} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teal hover:underline"
                        >
                          {empresa.sitio_web}
                        </a>
                      ) : (
                        'No disponible'
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Periodo de Vencimiento de Facturas</h3>
                    <p className="text-lg text-gray-800">{empresa.periodo_vencimiento_facturas}</p>
                  </div>
                </div>
                
                {empresa.descripcion && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
                    <p className="text-gray-800 whitespace-pre-wrap">{empresa.descripcion}</p>
                  </div>
                )}
                
                <div className="mt-6 text-sm text-gray-500">
                  <div>Creado: {new Date(empresa.created_at).toLocaleDateString()}</div>
                  <div>Última actualización: {new Date(empresa.updated_at).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
