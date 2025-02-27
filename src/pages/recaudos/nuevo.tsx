import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, Search } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { CreateClienteDialog } from "@/components/CreateClienteDialog";
import { CreateProveedorDialog } from "@/components/CreateProveedorDialog";

const estadosRecaudo = [
  { value: "pendiente", label: "Pendiente de recaudo", color: "#FEF7CD" },
  { value: "en_proceso", label: "En proceso", color: "#F2FCE2" },
  { value: "recaudado", label: "Recaudado", color: "#D3E4FD" },
  { value: "cancelado", label: "Cancelado", color: "#FFDEE2" },
  { value: "vencido", label: "Vencido", color: "#FDE1D3" },
] as const;

const clientes = [
  { id: 1, nombre: "Juan Pérez" },
  { id: 2, nombre: "María García" },
  { id: 3, nombre: "Carlos López" },
];

const agentes = [
  { id: 1, nombre: "Ana Martínez" },
  { id: 2, nombre: "Pedro Rodríguez" },
  { id: 3, nombre: "Laura González" },
];

const proveedores = [
  { id: 1, nombre: "Suministros Industriales S.A." },
  { id: 2, nombre: "Juan Pérez Distribuciones" },
];

const articuloSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  cantidad: z.number({
    required_error: "La cantidad es requerida",
    invalid_type_error: "La cantidad debe ser un número",
  }).min(1, "La cantidad debe ser mayor a 0"),
  proveedorId: z.number({
    required_error: "Debe seleccionar un proveedor",
    invalid_type_error: "Debe seleccionar un proveedor",
  }).min(1, "Debe seleccionar un proveedor"),
  precio: z.number({
    required_error: "El precio es requerido",
    invalid_type_error: "El precio debe ser un número",
  }).min(0, "El precio debe ser mayor o igual a 0"),
  aplicaIVA: z.boolean().default(false),
});

const recaudoSchema = z.object({
  numeroRecaudo: z.string(),
  clienteId: z.number({
    required_error: "Debe seleccionar un cliente",
    invalid_type_error: "Debe seleccionar un cliente",
  }).min(1, "Debe seleccionar un cliente"),
  agenteId: z.number({
    required_error: "Debe seleccionar un agente",
    invalid_type_error: "Debe seleccionar un agente",
  }).min(1, "Debe seleccionar un agente"),
  estado: z.string().default("pendiente"),
  fechaVencimiento: z.string().min(1, "La fecha de vencimiento es requerida"),
  articulos: z.array(articuloSchema).min(1, "Debe agregar al menos un artículo"),
  observaciones: z.string().optional(),
});

type RecaudoForm = z.infer<typeof recaudoSchema>;
type ArticuloForm = z.infer<typeof articuloSchema>;

export default function NuevoRecaudo() {
  const navigate = useNavigate();
  const [clienteSearch, setClienteSearch] = useState("");
  const [agenteSearch, setAgenteSearch] = useState("");
  const [proveedorSearch, setProveedorSearch] = useState("");
  const [articulos, setArticulos] = useState<ArticuloForm[]>([]);
  const [archivos, setArchivos] = useState<File[]>([]);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(clienteSearch.toLowerCase())
  );

  const filteredAgentes = agentes.filter(agente =>
    agente.nombre.toLowerCase().includes(agenteSearch.toLowerCase())
  );

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(proveedorSearch.toLowerCase())
  );

  const recaudoForm = useForm<RecaudoForm>({
    resolver: zodResolver(recaudoSchema),
    defaultValues: {
      numeroRecaudo: "0001",
      clienteId: 0,
      agenteId: 0,
      estado: "pendiente",
      fechaVencimiento: "",
      articulos: [],
    },
  });

  const articuloForm = useForm<ArticuloForm>({
    resolver: zodResolver(articuloSchema),
    defaultValues: {
      descripcion: "",
      cantidad: 1,
      proveedorId: 0,
      precio: 0,
      aplicaIVA: false,
    },
  });

  const handleSelectCliente = (cliente: typeof clientes[0]) => {
    recaudoForm.setValue("clienteId", cliente.id);
    setClienteSearch("");
  };

  const handleSelectAgente = (agente: typeof agentes[0]) => {
    recaudoForm.setValue("agenteId", agente.id);
    setAgenteSearch("");
  };

  const handleSelectProveedor = (proveedor: typeof proveedores[0]) => {
    articuloForm.setValue("proveedorId", proveedor.id);
    setProveedorSearch("");
  };

  const handleAgregarArticulo = articuloForm.handleSubmit((data) => {
    setArticulos([...articulos, data]);
    recaudoForm.setValue("articulos", [...articulos, data]);
    
    articuloForm.reset({
      descripcion: "",
      cantidad: 1,
      proveedorId: 0,
      precio: 0,
      aplicaIVA: false,
    });
    setProveedorSearch("");
  });

  const handleEliminarArticulo = (index: number) => {
    const nuevosArticulos = articulos.filter((_, i) => i !== index);
    setArticulos(nuevosArticulos);
    recaudoForm.setValue("articulos", nuevosArticulos);
  };

  const calcularSubtotalArticulo = (articulo: ArticuloForm) => {
    const subtotal = articulo.cantidad * articulo.precio;
    return articulo.aplicaIVA ? subtotal * 1.19 : subtotal;
  };

  const calcularTotal = () => {
    return articulos.reduce((total, articulo) => {
      return total + calcularSubtotalArticulo(articulo);
    }, 0);
  };

  const handleFilesChange = (files: File[]) => {
    setArchivos(files);
  };

  const onSubmit = recaudoForm.handleSubmit(async (data) => {
    try {
      if (data.clienteId === 0) {
        toast.error("Debe seleccionar un cliente");
        return;
      }

      if (!data.articulos.length) {
        toast.error("Debe agregar al menos un artículo");
        return;
      }

      console.log("Datos del formulario:", data);
      console.log("Archivos adjuntos:", archivos);
      
      toast.success("Recaudo creado exitosamente");
      navigate("/recaudos");
    } catch (error) {
      console.error("Error al crear el recaudo:", error);
      toast.error("Error al crear el recaudo");
    }
  });

  const handleClienteCreated = (nuevoCliente: { id: number; nombre: string }) => {
    clientes.push(nuevoCliente);
    handleSelectCliente(nuevoCliente);
  };

  const handleProveedorCreated = (nuevoProveedor: { id: number; nombre: string }) => {
    proveedores.push(nuevoProveedor);
    handleSelectProveedor(nuevoProveedor);
  };

  return (
    <div className="min-h-screen flex bg-soft-gray/30">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              className="text-teal hover:bg-[#FEF7CD] hover:text-teal"
              onClick={() => navigate("/recaudos")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
            <Button
              onClick={() => {
                recaudoForm.reset();
                articuloForm.reset();
                setArticulos([]);
                setClienteSearch("");
                setAgenteSearch("");
                setProveedorSearch("");
              }}
              className="bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-teal"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Recaudo
            </Button>
          </div>

          <Card className="mb-6 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                Nuevo Recaudo N° {recaudoForm.getValues("numeroRecaudo")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...recaudoForm}>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={recaudoForm.control}
                      name="clienteId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Cliente</FormLabel>
                          <div className="relative">
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <Input
                                  placeholder="Buscar cliente..."
                                  value={clienteSearch}
                                  onChange={(e) => setClienteSearch(e.target.value)}
                                  className="w-full pr-10"
                                />
                                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                              </div>
                              <CreateClienteDialog onClienteCreated={handleClienteCreated} />
                            </div>
                            {clienteSearch && filteredClientes.length > 0 && (
                              <Card className="absolute z-10 w-full mt-1">
                                <CardContent className="p-2">
                                  {filteredClientes.map((cliente) => (
                                    <Button
                                      type="button"
                                      key={cliente.id}
                                      variant="ghost"
                                      className="w-full justify-start text-left"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSelectCliente(cliente);
                                      }}
                                    >
                                      {cliente.nombre}
                                    </Button>
                                  ))}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={recaudoForm.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {estadosRecaudo.map((estado) => (
                                <SelectItem
                                  key={estado.value}
                                  value={estado.value}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: estado.color }}
                                  />
                                  {estado.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={recaudoForm.control}
                      name="fechaVencimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Vencimiento</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={recaudoForm.control}
                      name="agenteId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Agente de Recaudo</FormLabel>
                          <div className="relative">
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <Input
                                  placeholder="Buscar agente..."
                                  value={agenteSearch}
                                  onChange={(e) => setAgenteSearch(e.target.value)}
                                  className="w-full pr-10"
                                />
                                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                              </div>
                              <CreateProveedorDialog onProveedorCreated={handleProveedorCreated} />
                            </div>
                            {agenteSearch && filteredAgentes.length > 0 && (
                              <Card className="absolute z-10 w-full mt-1">
                                <CardContent className="p-2">
                                  {filteredAgentes.map((agente) => (
                                    <Button
                                      type="button"
                                      key={agente.id}
                                      variant="ghost"
                                      className="w-full justify-start text-left"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSelectAgente(agente);
                                      }}
                                    >
                                      {agente.nombre}
                                    </Button>
                                  ))}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Agregar Artículo</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...articuloForm}>
                <form onSubmit={handleAgregarArticulo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={articuloForm.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción del Artículo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articuloForm.control}
                      name="cantidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articuloForm.control}
                      name="precio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio Unitario</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field
                              .onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={articuloForm.control}
                      name="proveedorId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Proveedor</FormLabel>
                          <div className="relative">
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <Input
                                  placeholder="Buscar proveedor..."
                                  value={proveedorSearch}
                                  onChange={(e) => setProveedorSearch(e.target.value)}
                                  className="w-full pr-10"
                                />
                                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                              </div>
                              <CreateProveedorDialog onProveedorCreated={handleProveedorCreated} />
                            </div>
                            {proveedorSearch && filteredProveedores.length > 0 && (
                              <Card className="absolute z-10 w-full mt-1">
                                <CardContent className="p-2">
                                  {filteredProveedores.map((proveedor) => (
                                    <Button
                                      type="button"
                                      key={proveedor.id}
                                      variant="ghost"
                                      className="w-full justify-start text-left"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSelectProveedor(proveedor);
                                      }}
                                    >
                                      {proveedor.nombre}
                                    </Button>
                                  ))}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={articuloForm.control}
                    name="aplicaIVA"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="m-0">¿Aplica IVA? (19%)</FormLabel>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-teal">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Artículo
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {articulos.length > 0 && (
            <Card className="mb-6 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Artículos Agregados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articulos.map((articulo, index) => (
                    <Card key={index} className="p-4 bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{articulo.descripcion}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {articulo.cantidad} x ${articulo.precio.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Proveedor: {proveedores.find(p => p.id === articulo.proveedorId)?.nombre}
                          </p>
                          {articulo.aplicaIVA && (
                            <p className="text-sm text-gray-600">IVA aplicado (19%)</p>
                          )}
                          <p className="mt-2 font-semibold">
                            Total: ${calcularSubtotalArticulo(articulo).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleEliminarArticulo(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  <div className="text-right">
                    <p className="text-xl font-bold text-teal">
                      Total General: ${calcularTotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <FileUpload onFilesChange={handleFilesChange} />

          <Card className="mb-6 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...recaudoForm}>
                <form className="space-y-4">
                  <FormField
                    control={recaudoForm.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Ingrese aquí cualquier observación o nota adicional sobre el recaudo..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Form {...recaudoForm}>
            <form onSubmit={onSubmit}>
              <Button type="submit" className="w-full bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-teal shadow-lg">
                <Save className="mr-2 h-4 w-4" />
                Guardar Recaudo
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
