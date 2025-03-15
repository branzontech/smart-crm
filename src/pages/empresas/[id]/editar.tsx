
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Loader2 } from "lucide-react";
import { fetchEmpresaById, updateEmpresa, Empresa } from "@/services/empresaService";
import { EmpresaForm, EmpresaFormValues } from "@/components/empresas/EmpresaForm";
import { toast } from "sonner";
import { EmpresaBreadcrumbs } from "@/components/empresas/EmpresaBreadcrumbs";
import { Button } from "@/components/ui/button";

export default function EditarEmpresa() {
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

  const handleSubmit = async (data: EmpresaFormValues) => {
    if (!id) return;

    try {
      // Transformar los datos para coincidir con la estructura de la tabla
      const empresaData = {
        nombre: data.nombre,
        industria: data.industria,
        empleados: parseInt(data.empleados),
        ciudad: data.ciudad,
        direccion: data.direccion,
        telefono: data.telefono,
        sitio_web: data.sitioWeb || undefined,
        descripcion: data.descripcion || undefined,
        periodo_vencimiento_facturas: data.periodoVencimientoFacturas,
      };
      
      await updateEmpresa(id, empresaData);
      toast.success("Empresa actualizada exitosamente");
      navigate(`/empresas/${id}`);
    } catch (error: any) {
      toast.error(`Error al actualizar la empresa: ${error.message}`);
      throw error; // Re-lanzar el error para que el componente EmpresaForm lo maneje
    }
  };

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

  // Convertir la empresa al formato esperado por el formulario
  const defaultValues: EmpresaFormValues = {
    nombre: empresa.nombre,
    industria: empresa.industria,
    empleados: empresa.empleados.toString(),
    ciudad: empresa.ciudad,
    direccion: empresa.direccion,
    telefono: empresa.telefono,
    sitioWeb: empresa.sitio_web || '',
    descripcion: empresa.descripcion || '',
    periodoVencimientoFacturas: empresa.periodo_vencimiento_facturas
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container overflow-y-auto">
          <div className="max-w-content">
            <EmpresaBreadcrumbs nombreEmpresa={empresa.nombre} />
            
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl font-semibold">Editar Empresa</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <EmpresaForm 
                  defaultValues={defaultValues}
                  onSubmit={handleSubmit} 
                  submitButtonText="Guardar Cambios" 
                  onCancel={() => navigate(`/empresas/${id}`)}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
