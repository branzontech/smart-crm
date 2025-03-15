
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Edit, Loader2 } from "lucide-react";
import { getProveedorById, Proveedor } from "@/services/proveedoresService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function DetalleProveedor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProveedor(id);
    }
  }, [id]);

  const fetchProveedor = async (proveedorId: string) => {
    setIsLoading(true);
    try {
      const data = await getProveedorById(proveedorId);
      setProveedor(data);
    } catch (error: any) {
      toast.error(`Error al cargar proveedor: ${error.message}`);
      console.error("Error fetching proveedor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Navbar />
        <div className="main-container">
          <main className="flex-1 content-container">
            <div className="max-w-content flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-teal" />
              <span className="ml-2">Cargando detalles del proveedor...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Navbar />
        <div className="main-container">
          <main className="flex-1 content-container">
            <div className="max-w-content">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
                  onClick={() => navigate("/proveedores")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al listado
                </Button>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No se encontró el proveedor solicitado</p>
                    <Button 
                      onClick={() => navigate("/proveedores")}
                      className="bg-teal hover:bg-teal/90"
                    >
                      Volver al listado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
                onClick={() => navigate("/proveedores")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-teal" />
                    <CardTitle className="text-2xl">{proveedor.nombre}</CardTitle>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/proveedores/${proveedor.id}/editar`)}
                    className="text-teal hover:bg-teal/10"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Información General</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Tipo de Documento</p>
                        <p className="font-medium">{proveedor.tipo_documento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Número de Documento</p>
                        <p className="font-medium">{proveedor.documento}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contacto</p>
                        <p className="font-medium">{proveedor.contacto}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1">Clasificación</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Tipo de Proveedor</p>
                        <p className="font-medium">{proveedor.tipo_proveedor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sector</p>
                        <p className="font-medium">{proveedor.sectores?.nombre || "No especificado"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Descripción</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{proveedor.descripcion || "Sin descripción"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
