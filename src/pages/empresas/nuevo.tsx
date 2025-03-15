
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmpresaForm, EmpresaFormValues } from "@/components/empresas/EmpresaForm";
import { createEmpresa } from "@/services/empresaService";

export default function NuevaEmpresa() {
  const navigate = useNavigate();

  const handleSubmit = async (data: EmpresaFormValues) => {
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
      
      await createEmpresa(empresaData);
      toast.success("Empresa creada exitosamente");
      navigate("/empresas");
    } catch (error: any) {
      toast.error(`Error al crear la empresa: ${error.message}`);
      throw error; // Re-lanzar el error para que el componente EmpresaForm lo maneje
    }
  };

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
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl font-semibold">Nueva Empresa</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <EmpresaForm 
                  onSubmit={handleSubmit} 
                  submitButtonText="Crear Empresa" 
                  onCancel={() => navigate("/empresas")}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
