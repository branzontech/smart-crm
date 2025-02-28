
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Printer, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContratoBuilder } from "@/components/contratos/ContratoBuilder";
import { CreateClienteDialog } from "@/components/CreateClienteDialog";
import { CreateProveedorDialog } from "@/components/CreateProveedorDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function NuevoContrato() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("Contrato de Prestación de Servicios");
  
  // Datos de las partes involucradas
  const [contratante, setContratante] = useState({
    nombre: "",
    identificacion: "",
    cargo: "Representante Legal"
  });
  
  const [contratista, setContratista] = useState({
    nombre: "",
    identificacion: ""
  });
  
  // Mock data para clientes y proveedores
  const [clientes, setClientes] = useState([
    { id: 1, nombre: "Empresa ABC", identificacion: "900.123.456-7" },
    { id: 2, nombre: "Constructora XYZ", identificacion: "800.456.789-0" },
    { id: 3, nombre: "Industrias 123", identificacion: "901.567.890-1" }
  ]);
  
  const [proveedores, setProveedores] = useState([
    { id: 1, nombre: "Juan Pérez", identificacion: "1.234.567.890" },
    { id: 2, nombre: "María Gómez", identificacion: "9.876.543.210" },
    { id: 3, nombre: "Carlos Rodríguez", identificacion: "5.678.901.234" }
  ]);
  
  const form = useForm();
  
  const handleClienteSeleccionado = (id: string) => {
    const clienteSeleccionado = clientes.find(c => c.id.toString() === id);
    if (clienteSeleccionado) {
      setContratante({
        nombre: clienteSeleccionado.nombre,
        identificacion: clienteSeleccionado.identificacion,
        cargo: contratante.cargo
      });
    }
  };
  
  const handleProveedorSeleccionado = (id: string) => {
    const proveedorSeleccionado = proveedores.find(p => p.id.toString() === id);
    if (proveedorSeleccionado) {
      setContratista({
        nombre: proveedorSeleccionado.nombre,
        identificacion: proveedorSeleccionado.identificacion
      });
    }
  };
  
  const handleClienteCreado = (cliente: { id: number; nombre: string }) => {
    setClientes([...clientes, { ...cliente, identificacion: "Pendiente" }]);
  };
  
  const handleProveedorCreado = (proveedor: { id: number; nombre: string }) => {
    setProveedores([...proveedores, { ...proveedor, identificacion: "Pendiente" }]);
  };
  
  const handleContratanteChange = (field: keyof typeof contratante, value: string) => {
    setContratante({ ...contratante, [field]: value });
  };
  
  const handleContratistaChange = (field: keyof typeof contratista, value: string) => {
    setContratista({ ...contratista, [field]: value });
  };
  
  const handleGuardar = () => {
    if (!titulo.trim()) {
      toast.error("Debes asignar un título al contrato");
      return;
    }
    
    if (!contratante.nombre || !contratista.nombre) {
      toast.error("Debes especificar los datos de ambas partes");
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
    if (!contratante.nombre || !contratista.nombre) {
      toast.error("Debes especificar los datos de ambas partes para firmar");
      return;
    }
    
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Información básica del contrato */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Información del Contrato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
              
              {/* Información del Contratante */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Contratante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium">Seleccionar Cliente</label>
                      <CreateClienteDialog onClienteCreated={handleClienteCreado} />
                    </div>
                    
                    <Select onValueChange={handleClienteSeleccionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div>
                      <label htmlFor="contratante-nombre" className="block text-sm font-medium mb-1">
                        Nombre
                      </label>
                      <Input
                        id="contratante-nombre"
                        value={contratante.nombre}
                        onChange={(e) => handleContratanteChange("nombre", e.target.value)}
                        placeholder="Nombre del contratante"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contratante-identificacion" className="block text-sm font-medium mb-1">
                        Identificación
                      </label>
                      <Input
                        id="contratante-identificacion"
                        value={contratante.identificacion}
                        onChange={(e) => handleContratanteChange("identificacion", e.target.value)}
                        placeholder="NIT o documento"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contratante-cargo" className="block text-sm font-medium mb-1">
                        Cargo
                      </label>
                      <Input
                        id="contratante-cargo"
                        value={contratante.cargo}
                        onChange={(e) => handleContratanteChange("cargo", e.target.value)}
                        placeholder="Cargo del representante"
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Información del Contratista */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Contratista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium">Seleccionar Proveedor</label>
                        <CreateProveedorDialog onProveedorCreated={handleProveedorCreado} />
                      </div>
                      
                      <Select onValueChange={handleProveedorSeleccionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {proveedores.map((proveedor) => (
                            <SelectItem key={proveedor.id} value={proveedor.id.toString()}>
                              {proveedor.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="contratista-nombre" className="block text-sm font-medium mb-1">
                          Nombre
                        </label>
                        <Input
                          id="contratista-nombre"
                          value={contratista.nombre}
                          onChange={(e) => handleContratistaChange("nombre", e.target.value)}
                          placeholder="Nombre del contratista"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="contratista-identificacion" className="block text-sm font-medium mb-1">
                          Identificación
                        </label>
                        <Input
                          id="contratista-identificacion"
                          value={contratista.identificacion}
                          onChange={(e) => handleContratistaChange("identificacion", e.target.value)}
                          placeholder="Documento de identidad"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <ContratoBuilder 
              titulo={titulo} 
              contratante={contratante}
              contratista={contratista}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
