
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Printer, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContratoBuilder } from "@/components/contratos/ContratoBuilder";

export default function NuevoContrato() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  
  const handleGuardar = () => {
    if (!titulo.trim()) {
      toast.error("Debes asignar un título al contrato");
      return;
    }
    
    // Lógica para guardar el contrato
    toast.success("Contrato guardado con éxito");
  };
  
  const handleImprimir = () => {
    window.print();
    toast.success("Imprimiendo contrato");
  };
  
  const handleFirmar = () => {
    toast.success("Se ha enviado el contrato para firmas");
    // Redirección al firmador o notificación a las partes
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col ml-20 transition-all duration-300">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="text-teal hover:text-sage hover:bg-mint/20"
                  onClick={() => navigate("/ventas/contratos")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <h1 className="text-2xl font-semibold text-gray-800">Nuevo Contrato</h1>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGuardar} variant="default" className="bg-teal hover:bg-sage">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
                <Button onClick={handleImprimir} variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button onClick={handleFirmar} variant="default" className="bg-teal hover:bg-sage">
                  <FileSignature className="mr-2 h-4 w-4" />
                  Firmar
                </Button>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Información Básica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium mb-1">
                      Título del Contrato
                    </label>
                    <Input
                      id="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ej: Contrato de Prestación de Servicios"
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <ContratoBuilder titulo={titulo} />
          </div>
        </main>
      </div>
    </div>
  );
}
