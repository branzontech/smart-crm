
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOportunidadById, Oportunidad } from "@/services/oportunidadesService";
import { OportunidadDrawer } from "@/components/oportunidades/OportunidadDrawer";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Pencil, Percent } from "lucide-react";
import { Link } from "react-router-dom";

export default function OportunidadDetalle() {
  const { id } = useParams<{ id: string }>();
  const [oportunidad, setOportunidad] = useState<Oportunidad | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const loadOportunidad = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await getOportunidadById(id);
        setOportunidad(data);
      } catch (error) {
        console.error("Error loading opportunity:", error);
        toast.error("No se pudo cargar la información de la oportunidad");
      } finally {
        setLoading(false);
      }
    };

    loadOportunidad();
  }, [id]);

  const handleOportunidadUpdated = async () => {
    if (!id) return;
    
    try {
      const data = await getOportunidadById(id);
      setOportunidad(data);
      toast.success("Oportunidad actualizada correctamente");
    } catch (error) {
      console.error("Error reloading opportunity:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link to="/ventas/oportunidades">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Detalle de Oportunidad</h1>
          </div>
          
          {oportunidad && (
            <Button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-teal-500 hover:bg-teal-600"
            >
              <Pencil className="h-4 w-4 mr-2" /> 
              Editar Oportunidad
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : oportunidad ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Cliente: {oportunidad.cliente}</span>
                  <span className="text-sm font-normal bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {oportunidad.etapa.charAt(0).toUpperCase() + oportunidad.etapa.slice(1)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
                    <p className="mt-1">{oportunidad.descripcion || "Sin descripción"}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Valor</h3>
                      <p className="mt-1 text-xl font-semibold">{formatCurrency(oportunidad.valor)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fecha de cierre</h3>
                      <p className="mt-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(oportunidad.fecha_cierre).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Información Adicional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Probabilidad</h3>
                    <div className="flex items-center mt-1">
                      <Percent className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{oportunidad.probabilidad}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-teal-500 h-2.5 rounded-full" 
                        style={{ width: `${oportunidad.probabilidad}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Creado</h3>
                    <p className="mt-1">
                      {oportunidad.created_at ? new Date(oportunidad.created_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Última actualización</h3>
                    <p className="mt-1">
                      {oportunidad.updated_at ? new Date(oportunidad.updated_at).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-gray-500">No se encontró la oportunidad</p>
            <Link to="/ventas/oportunidades" className="mt-4">
              <Button>Volver a oportunidades</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Drawer para editar la oportunidad */}
      {oportunidad && id && (
        <OportunidadDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          oportunidadId={id}
          onUpdate={handleOportunidadUpdated}
        />
      )}
    </Layout>
  );
}
