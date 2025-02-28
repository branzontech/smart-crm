
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Coins, BanknoteIcon, Plus, Trash2, Search } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { CreateClienteDialog } from "@/components/CreateClienteDialog";
import { CreateProveedorDialog } from "@/components/CreateProveedorDialog";

// Esquema para los artículos
const articuloSchema = z.object({
  id: z.string().optional(),
  proveedor: z.string().min(1, { message: "El proveedor es requerido" }),
  nombreProveedor: z.string().optional(),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
  valorUnitario: z.number().min(0, { message: "El valor unitario debe ser mayor o igual a 0" }),
  valorTotal: z.number().min(0, { message: "El valor total debe ser mayor o igual a 0" }),
});

// Esquema de validación para el formulario principal
const formSchema = z.object({
  cliente: z.string().min(1, { message: "Seleccione un cliente" }),
  clienteNombre: z.string().optional(),
  monto: z.string().min(1, { message: "Ingrese el monto" }),
  subtotal: z.number().min(0, { message: "El subtotal debe ser mayor o igual a 0" }),
  iva: z.number().min(0, { message: "El IVA debe ser mayor o igual a 0" }),
  total: z.number().min(0, { message: "El total debe ser mayor o igual a 0" }),
  metodoPago: z.string().min(1, { message: "Seleccione un método de pago" }),
  fechaPago: z.string().min(1, { message: "Seleccione una fecha de pago" }),
  fechaVencimiento: z.string().min(1, { message: "Seleccione una fecha de vencimiento" }),
  estado: z.string().min(1, { message: "Seleccione un estado" }),
  notas: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Articulo = z.infer<typeof articuloSchema>;

const NuevoRecaudo = () => {
  const navigate = useNavigate();
  const [nextRecaudoNumber, setNextRecaudoNumber] = useState(1);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [clienteQuery, setClienteQuery] = useState("");
  const [proveedorQuery, setProveedorQuery] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<any[]>([]);
  
  const [nuevoArticulo, setNuevoArticulo] = useState<{
    proveedor: string;
    nombreProveedor: string;
    descripcion: string;
    cantidad: number;
    valorUnitario: number;
  }>({
    proveedor: "",
    nombreProveedor: "",
    descripcion: "",
    cantidad: 1,
    valorUnitario: 0,
  });
  
  // Lista de clientes (normalmente vendría de una API)
  const clientes = [
    { id: "1", nombre: "Tech Solutions SA" },
    { id: "2", nombre: "Green Energy Corp" },
    { id: "3", nombre: "Global Logistics" },
    { id: "4", nombre: "Digital Systems Inc" },
    { id: "5", nombre: "Smart Solutions" },
  ];
  
  // Lista de proveedores
  const proveedores = [
    { id: "1", nombre: "ProveedorTech SA" },
    { id: "2", nombre: "Insumos Digitales" },
    { id: "3", nombre: "Servicios Globales" },
    { id: "4", nombre: "Componentes XYZ" },
    { id: "5", nombre: "Tecnología Avanzada" },
  ];
  
  // Métodos de pago disponibles
  const metodosPago = [
    { id: "transferencia", nombre: "Transferencia Bancaria" },
    { id: "efectivo", nombre: "Efectivo" },
    { id: "cheque", nombre: "Cheque" },
    { id: "tarjeta", nombre: "Tarjeta de Crédito/Débito" },
    { id: "app", nombre: "Aplicación de Pago" },
  ];
  
  // Estados de recaudo
  const estados = [
    { id: "pendiente", nombre: "Pendiente" },
    { id: "enproceso", nombre: "En Proceso" },
    { id: "pagado", nombre: "Pagado" },
    { id: "vencido", nombre: "Vencido" },
  ];
  
  // Tasas de IVA
  const tasasIVA = [
    { valor: 0, etiqueta: "0%" },
    { valor: 0.05, etiqueta: "5%" },
    { valor: 0.16, etiqueta: "16%" },
    { valor: 0.19, etiqueta: "19%" },
  ];
  
  // Simular obtención del siguiente número de recaudo
  useEffect(() => {
    // En un caso real, esto vendría de la API
    const fetchNextRecaudoNumber = () => {
      // Simular retraso de API
      setTimeout(() => {
        setNextRecaudoNumber(123);
      }, 500);
    };
    
    fetchNextRecaudoNumber();
  }, []);
  
  useEffect(() => {
    if (clienteQuery) {
      const filtered = clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(clienteQuery.toLowerCase())
      );
      setClientesFiltrados(filtered);
    } else {
      setClientesFiltrados([]);
    }
  }, [clienteQuery]);
  
  useEffect(() => {
    if (proveedorQuery) {
      const filtered = proveedores.filter(proveedor => 
        proveedor.nombre.toLowerCase().includes(proveedorQuery.toLowerCase())
      );
      setProveedoresFiltrados(filtered);
    } else {
      setProveedoresFiltrados([]);
    }
  }, [proveedorQuery]);
  
  // Configurar el formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      clienteNombre: "",
      monto: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      metodoPago: "transferencia",
      fechaPago: new Date().toISOString().substring(0, 10),
      fechaVencimiento: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().substring(0, 10),
      estado: "pendiente",
      notas: "",
    },
  });
  
  // Cálculos automáticos cuando se actualizan los artículos
  const calcularTotales = () => {
    const subtotal = articulos.reduce((sum, item) => sum + (item.valorTotal || 0), 0);
    const tasaIva = 0.19; // Tasa por defecto, se podría hacer seleccionable
    const iva = subtotal * tasaIva;
    const total = subtotal + iva;
    
    form.setValue('subtotal', subtotal);
    form.setValue('iva', iva);
    form.setValue('total', total);
    form.setValue('monto', total.toString());
  };
  
  // Agregar un nuevo artículo a la lista
  const agregarArticulo = () => {
    if (!nuevoArticulo.proveedor || !nuevoArticulo.descripcion) {
      toast.error("El proveedor y la descripción son requeridos");
      return;
    }
    
    const valorTotal = nuevoArticulo.cantidad * nuevoArticulo.valorUnitario;
    const articulo: Articulo = {
      id: `art-${Date.now()}`,
      proveedor: nuevoArticulo.proveedor,
      nombreProveedor: nuevoArticulo.nombreProveedor,
      descripcion: nuevoArticulo.descripcion,
      cantidad: nuevoArticulo.cantidad,
      valorUnitario: nuevoArticulo.valorUnitario,
      valorTotal,
    };
    
    const nuevosArticulos = [...articulos, articulo];
    setArticulos(nuevosArticulos);
    
    // Resetear el formulario de nuevo artículo
    setNuevoArticulo({
      proveedor: "",
      nombreProveedor: "",
      descripcion: "",
      cantidad: 1,
      valorUnitario: 0,
    });
    
    // Limpiar la búsqueda de proveedor
    setProveedorQuery("");
    setProveedoresFiltrados([]);
    
    // Actualizar totales
    setTimeout(() => calcularTotales(), 0);
  };
  
  // Eliminar un artículo de la lista
  const eliminarArticulo = (id: string) => {
    const nuevosArticulos = articulos.filter(articulo => articulo.id !== id);
    setArticulos(nuevosArticulos);
    setTimeout(() => calcularTotales(), 0);
  };
  
  const seleccionarCliente = (cliente: any) => {
    form.setValue('cliente', cliente.id);
    form.setValue('clienteNombre', cliente.nombre);
    setClienteQuery(cliente.nombre);
    setClientesFiltrados([]);
  };
  
  const seleccionarProveedor = (proveedor: any) => {
    setNuevoArticulo({
      ...nuevoArticulo,
      proveedor: proveedor.id,
      nombreProveedor: proveedor.nombre,
    });
    setProveedorQuery(proveedor.nombre);
    setProveedoresFiltrados([]);
  };
  
  // Aquí está el cambio, de onClienteCreado a onClienteCreated
  const handleClienteCreated = (cliente: { id: number; nombre: string }) => {
    form.setValue('cliente', cliente.id.toString());
    form.setValue('clienteNombre', cliente.nombre);
    setClienteQuery(cliente.nombre);
  };
  
  // Aquí está el cambio, de onProveedorCreado a onProveedorCreated
  const handleProveedorCreated = (proveedor: { id: number; nombre: string }) => {
    setNuevoArticulo({
      ...nuevoArticulo,
      proveedor: proveedor.id.toString(),
      nombreProveedor: proveedor.nombre,
    });
    setProveedorQuery(proveedor.nombre);
  };
  
  const onSubmit = (data: FormValues) => {
    if (articulos.length === 0) {
      toast.error("Debe agregar al menos un artículo");
      return;
    }
    
    const recaudoCompleto = {
      ...data,
      numero: `N°000${nextRecaudoNumber}`,
      articulos,
    };
    
    console.log("Datos del formulario:", recaudoCompleto);
    toast.success("Recaudo creado con éxito");
    
    // Normalmente aquí enviarías los datos a tu API
    // Después de guardar, redirigir a la lista de recaudos
    setTimeout(() => {
      navigate("/recaudos");
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container overflow-y-auto">
          <div className="max-w-content">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-teal hover:text-sage hover:bg-mint/20"
                  onClick={() => navigate("/recaudos")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <Coins className="h-6 w-6 text-teal" />
                  Nuevo Recaudo N°{String(nextRecaudoNumber).padStart(3, '0')}
                </h1>
              </div>
            </div>
            
            <Card className="bg-white mb-6">
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormLabel>Cliente</FormLabel>
                        <div className="relative">
                          <div className="flex space-x-2 mb-2">
                            <div className="relative flex-grow">
                              <Input
                                placeholder="Buscar cliente..."
                                value={clienteQuery}
                                onChange={(e) => setClienteQuery(e.target.value)}
                                className="pr-10"
                              />
                              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                            {/* Cambio de onClienteCreado a onClienteCreated */}
                            <CreateClienteDialog onClienteCreated={handleClienteCreated} />
                          </div>
                          
                          {clientesFiltrados.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                              {clientesFiltrados.map(cliente => (
                                <div
                                  key={cliente.id}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => seleccionarCliente(cliente)}
                                >
                                  {cliente.nombre}
                                </div>
                              ))}
                            </div>
                          )}
                          <FormMessage>
                            {form.formState.errors.cliente?.message}
                          </FormMessage>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="metodoPago"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Método de Pago</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar método" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {metodosPago.map((metodo) => (
                                  <SelectItem 
                                    key={metodo.id} 
                                    value={metodo.id}
                                  >
                                    {metodo.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fechaPago"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Pago</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="date" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fechaVencimiento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Vencimiento</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="date" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
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
                                  <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {estados.map((estado) => (
                                  <SelectItem 
                                    key={estado.id} 
                                    value={estado.id}
                                  >
                                    {estado.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Sección de Artículos */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Artículos o Servicios por Proveedor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 grid grid-cols-1 gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="proveedor">Proveedor</Label>
                              <div className="relative">
                                <div className="flex space-x-2">
                                  <div className="relative flex-grow">
                                    <Input
                                      id="proveedor"
                                      placeholder="Buscar proveedor..."
                                      value={proveedorQuery}
                                      onChange={(e) => setProveedorQuery(e.target.value)}
                                      className="pr-10"
                                    />
                                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                  </div>
                                  {/* Cambio de onProveedorCreado a onProveedorCreated */}
                                  <CreateProveedorDialog onProveedorCreated={handleProveedorCreated} />
                                </div>
                                
                                {proveedoresFiltrados.length > 0 && (
                                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                    {proveedoresFiltrados.map(proveedor => (
                                      <div
                                        key={proveedor.id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => seleccionarProveedor(proveedor)}
                                      >
                                        {proveedor.nombre}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="descripcion">Descripción</Label>
                              <Input 
                                id="descripcion"
                                placeholder="Descripción del artículo o servicio" 
                                value={nuevoArticulo.descripcion} 
                                onChange={(e) => setNuevoArticulo({...nuevoArticulo, descripcion: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cantidad">Cantidad</Label>
                              <Input 
                                id="cantidad"
                                type="number" 
                                min="1" 
                                value={nuevoArticulo.cantidad} 
                                onChange={(e) => setNuevoArticulo({...nuevoArticulo, cantidad: parseInt(e.target.value) || 1})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="valorUnitario">Valor Unitario</Label>
                              <Input 
                                id="valorUnitario"
                                type="number" 
                                min="0" 
                                value={nuevoArticulo.valorUnitario} 
                                onChange={(e) => setNuevoArticulo({...nuevoArticulo, valorUnitario: parseFloat(e.target.value) || 0})}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-2">
                            <Button 
                              type="button" 
                              className="bg-teal hover:bg-sage text-white"
                              onClick={agregarArticulo}
                              disabled={!nuevoArticulo.proveedor || !nuevoArticulo.descripcion}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar Artículo
                            </Button>
                          </div>
                        </div>
                        
                        {articulos.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Proveedor</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="text-right">Cantidad</TableHead>
                                <TableHead className="text-right">Valor Unitario</TableHead>
                                <TableHead className="text-right">Valor Total</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {articulos.map((articulo) => (
                                <TableRow key={articulo.id}>
                                  <TableCell>{articulo.nombreProveedor}</TableCell>
                                  <TableCell>{articulo.descripcion}</TableCell>
                                  <TableCell className="text-right">{articulo.cantidad}</TableCell>
                                  <TableCell className="text-right">
                                    ${articulo.valorUnitario.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${articulo.valorTotal.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => eliminarArticulo(articulo.id!)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No hay artículos agregados
                          </div>
                        )}
                        
                        {/* Resumen de totales */}
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Subtotal:</span>
                            <span>${form.watch('subtotal').toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">IVA (19%):</span>
                            <span>${form.watch('iva').toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span>${form.watch('total').toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Notas adicionales */}
                    <FormField
                      control={form.control}
                      name="notas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Observaciones o notas adicionales" 
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/recaudos")}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-teal hover:bg-sage text-white"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Recaudo
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NuevoRecaudo;
