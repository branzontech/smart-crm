
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Search, 
  FileCheck, 
  FileClock, 
  FilePenLine,
  MoreHorizontal,
  Trash2, 
  Copy
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Contrato {
  id: string;
  titulo: string;
  cliente: string;
  fechaCreacion: string;
  estado: "borrador" | "pendiente_firma" | "firmado";
}

export default function Contratos() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data
  const contratos: Contrato[] = [
    {
      id: "1",
      titulo: "Contrato de Prestación de Servicios",
      cliente: "Empresa ABC",
      fechaCreacion: "2023-06-15",
      estado: "firmado"
    },
    {
      id: "2",
      titulo: "Contrato de Confidencialidad",
      cliente: "Constructora XYZ",
      fechaCreacion: "2023-07-22",
      estado: "pendiente_firma"
    },
    {
      id: "3",
      titulo: "Contrato de Suministro",
      cliente: "Industrias 123",
      fechaCreacion: "2023-08-10",
      estado: "borrador"
    },
  ];
  
  const filteredContratos = contratos.filter(
    (contrato) =>
      contrato.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "borrador":
        return (
          <Badge variant="outline" className="border-orange-400 text-orange-500">
            <FilePenLine className="mr-1 h-3 w-3" />
            Borrador
          </Badge>
        );
      case "pendiente_firma":
        return (
          <Badge variant="outline" className="border-blue-400 text-blue-500">
            <FileClock className="mr-1 h-3 w-3" />
            Pendiente de firma
          </Badge>
        );
      case "firmado":
        return (
          <Badge variant="outline" className="border-green-400 text-green-500">
            <FileCheck className="mr-1 h-3 w-3" />
            Firmado
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const eliminarContrato = (id: string) => {
    // Lógica para eliminar el contrato
    toast.success("Contrato eliminado correctamente");
  };
  
  const duplicarContrato = (id: string) => {
    // Lógica para duplicar el contrato
    toast.success("Contrato duplicado correctamente");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col ml-20 transition-all duration-300">
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-teal mr-2" />
                <h1 className="text-2xl font-semibold text-gray-800">Contratos</h1>
              </div>
              <Button 
                onClick={() => navigate("/ventas/contratos/nuevo")}
                className="bg-teal hover:bg-sage"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Contrato
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar contrato..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContratos.map((contrato) => (
                <Card key={contrato.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{contrato.titulo}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/ventas/contratos/${contrato.id}`)}>
                            Ver contrato
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicarContrato(contrato.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => eliminarContrato(contrato.id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Cliente:</span>
                        <span className="text-sm font-medium">{contrato.cliente}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Fecha:</span>
                        <span className="text-sm">{new Date(contrato.fechaCreacion).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Estado:</span>
                        {getEstadoBadge(contrato.estado)}
                      </div>
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/ventas/contratos/${contrato.id}`)}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredContratos.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron contratos</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Comienza creando un nuevo contrato o ajusta tu búsqueda.
                </p>
                <div className="mt-6">
                  <Button 
                    onClick={() => navigate("/ventas/contratos/nuevo")}
                    className="bg-teal hover:bg-sage"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Contrato
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
