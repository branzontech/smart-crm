import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Coins, Plus, Trash2, Search } from "lucide-react";
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
import { FileUpload } from "@/components/FileUpload";
import { getClientes } from "@/services/clientesService";
import { getNextRecaudoNumber, createRecaudo, ArticuloRecaudo } from "@/services/recaudosService";
import { supabase } from "@/integrations/supabase/client";

const articuloSchema = z.object({
  id: z.string().optional(),
  proveedor_id: z.string().min(1, { message: "El proveedor es requerido" }),
  nombreProveedor: z.string().optional(),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
  valor_unitario: z.number().min(0, { message: "El valor unitario debe ser mayor o igual a 0" }),
  valor_total: z.number().min(0, { message: "El valor total debe ser mayor o igual a 0" }),
  tasa_iva: z.number().min(0, { message: "La tasa de IVA debe ser mayor o igual a 0" }),
  valor_iva: z.number().min(0, { message: "El valor del IVA debe ser mayor o igual a 0" }),
});

const formSchema = z.object({
  cliente_id: z.string().min(1, { message: "Seleccione un cliente" }),
  clienteNombre: z.string().optional(),
  monto: z.string().min(1, { message: "Ingrese el monto" }),
  subtotal: z.number().min(0, { message: "El subtotal debe ser mayor o igual a 0" }),
  iva: z.number().min(0, { message: "El IVA debe ser mayor o igual a 0" }),
  total: z.number().min(0, { message: "El total debe ser mayor o igual a 0" }),
  metodo_pago: z.string().min(1, { message: "Seleccione un método de pago" }),
  fecha_pago: z.string().min(1, { message: "Seleccione una fecha de pago" }),
  fecha_vencimiento: z.string().min(1, { message: "Seleccione una fecha de vencimiento" }),
  estado: z.string().min(1, { message: "Seleccione un estado" }),
  notas: z.string().optional(),
  archivos: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Articulo = z.infer<typeof articuloSchema>;

const NuevoRecaudo = () => {
  const navigate = useNavigate();
  const [nextRecaudoNumber, setNextRecaudoNumber] = useState("");
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [clienteQuery, setClienteQuery] = useState("");
  const [proveedorQuery, setProveedorQuery] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nuevoArticulo, setNuevoArticulo] = useState<{
    proveedor_id: string;
    nombreProveedor: string;
    descripcion: string;
    cantidad: number;
    valor_unitario: number;
    tasa_iva: number;
  }>({
    proveedor_id: "",
    nombreProveedor: "",
    descripcion: "",
    cantidad: 1,
    valor_unitario: 0,
    tasa_iva: 0.19,
  });
  const [archivos, setArchivos] = useState<File[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const metodosPago = [
    { id: "transferencia", nombre: "Transferencia Bancaria" },
    { id: "efectivo", nombre: "Efectivo" },
    { id: "cheque", nombre: "Cheque" },
    { id: "tarjeta", nombre: "Tarjeta de Crédito/Débito" },
    { id: "app", nombre: "Aplicación de Pago" },
  ];

  const estados = [
    { id: "pendiente", nombre: "Pendiente" },
    { id: "enproceso", nombre: "En Proceso" },
    { id: "pagado", nombre: "Pagado" },
    { id: "vencido", nombre: "Vencido" },
  ];

  const tasasIVA = [
    { valor: 0, etiqueta: "0%" },
    { valor: 0.05, etiqueta: "5%" },
    { valor: 0.16, etiqueta: "16%" },
    { valor: 0.19, etiqueta: "19%" },
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch next recaudo number
        const recaudoNumber = await getNextRecaudoNumber();
        setNextRecaudoNumber(recaudoNumber);
        
        // Fetch clientes
        const { data: clientesData } = await getClientes();
        if (clientesData) {
          setClientes(clientesData.map(cliente => ({
            id: cliente.id,
            nombre: cliente.tipo_persona === 'juridica' 
              ? cliente.empresa 
              : `${cliente.nombre} ${cliente.apellidos || ''}`
          })));
        }
        
        // Fetch proveedores
        const { data: proveedoresData, error: proveedoresError } = await supabase
          .from('proveedores')
          .select('id, nombre');
          
        if (proveedoresError) throw proveedoresError;
        if (proveedoresData) {
          setProveedores(proveedoresData);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Error cargando datos iniciales");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      if (clienteQuery && clienteQuery.length >= 2) {
        try {
          const { data, error } = await supabase
            .from('clientes')
            .select('id, nombre, apellidos, empresa, tipo_persona')
            .or(`nombre.ilike.%${clienteQuery}%,apellidos.ilike.%${clienteQuery}%,empresa.ilike.%${clienteQuery}%`)
            .limit(10);

          if (error) throw error;
          
          if (data) {
            const formattedClientes = data.map(cliente => ({
              id: cliente.id,
              nombre: cliente.tipo_persona === 'juridica' 
                ? cliente.empresa 
                : `${cliente.nombre} ${cliente.apellidos || ''}`
            }));
            
            setClientesFiltrados(formattedClientes);
          }
        } catch (error) {
          console.error("Error searching clientes:", error);
          toast.error("Error al buscar clientes");
        }
      } else {
        setClientesFiltrados([]);
      }
    };

    fetchClientes();
  }, [clienteQuery]);

  useEffect(() => {
    const fetchProveedores = async () => {
      if (proveedorQuery && proveedorQuery.length >= 2) {
        try {
          const { data, error } = await supabase
            .from('proveedores')
            .select('id, nombre')
            .ilike('nombre', `%${proveedorQuery}%`)
            .limit(10);

          if (error) throw error;
          
          if (data) {
            setProveedoresFiltrados(data);
          }
        } catch (error) {
          console.error("Error searching proveedores:", error);
          toast.error("Error al buscar proveedores");
        }
      } else {
        setProveedoresFiltrados([]);
      }
    };

    fetchProveedores();
  }, [proveedorQuery]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_id: "",
      clienteNombre: "",
      monto: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      metodo_pago: "transferencia",
      fecha_pago: new Date().toISOString().substring(0, 10),
      fecha_vencimiento: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().substring(0, 10),
      estado: "pendiente",
      notas: "",
      archivos: [],
    },
  });

  const calcularTotales = () => {
    const subtotal = articulos.reduce((sum, item) => sum + (item.valor_total || 0), 0);
    const iva = articulos.reduce((sum, item) => sum + (item.valor_iva || 0), 0);
    const total = subtotal + iva;
    
    form.setValue('subtotal', subtotal);
    form.setValue('iva', iva);
    form.setValue('total', total);
    form.setValue('monto', total.toString());
  };

  const agregarArticulo = () => {
    if (!nuevoArticulo.proveedor_id || !nuevoArticulo.descripcion) {
      toast.error("El proveedor y la descripción son requeridos");
      return;
    }
    
    const valorTotal = nuevoArticulo.cantidad * nuevoArticulo.valor_unitario;
    const valorIva = valorTotal * nuevoArticulo.tasa_iva;
    
    const articulo: Articulo = {
      id: `art-${Date.now()}`,
      proveedor_id: nuevoArticulo.proveedor_id,
      nombreProveedor: nuevoArticulo.nombreProveedor,
      descripcion: nuevoArticulo.descripcion,
      cantidad: nuevoArticulo.cantidad,
      valor_unitario: nuevoArticulo.valor_unitario,
      valor_total: valorTotal,
      tasa_iva: nuevoArticulo.tasa_iva,
      valor_iva: valorIva,
    };
    
    const nuevosArticulos = [...articulos, articulo];
    setArticulos(nuevosArticulos);
    
    setNuevoArticulo({
      proveedor_id: "",
      nombreProveedor: "",
      descripcion: "",
      cantidad: 1,
      valor_unitario: 0,
      tasa_iva: 0.19,
    });
    
    setProveedorQuery("");
    setProveedoresFiltrados([]);
    
    setTimeout(() => calcularTotales(), 0);
  };

  const eliminarArticulo = (id: string) => {
    const nuevosArticulos = articulos.filter(articulo => articulo.id !== id);
    setArticulos(nuevosArticulos);
    setTimeout(() => calcularTotales(), 0);
  };

  const seleccionarCliente = (cliente: any) => {
    form.setValue('cliente_id', cliente.id);
    form.setValue('clienteNombre', cliente.nombre);
    setClienteQuery(cliente.nombre);
    setClientesFiltrados([]);
  };

  const seleccionarProveedor = (proveedor: any) => {
    setNuevoArticulo({
      ...nuevoArticulo,
      proveedor_id: proveedor.id,
      nombreProveedor: proveedor.nombre,
    });
    setProveedorQuery(proveedor.nombre);
    setProveedoresFiltrados([]);
  };

  const handleClienteCreated = (cliente: { id: number | string; nombre: string }) => {
    // Add to the local list
    const newCliente = {
      id: cliente.id.toString(),
      nombre: cliente.nombre
    };
    
    setClientes([newCliente, ...clientes]);
    
    // Select the created cliente
    form.setValue('cliente_id', newCliente.id);
    form.setValue('clienteNombre', newCliente.nombre);
    setClienteQuery(newCliente.nombre);
  };

  const handleProveedorCreated = (proveedor: { id: number | string; nombre: string }) => {
    // Add to the local list
    const newProveedor = {
      id: proveedor.id.toString(),
      nombre: proveedor.nombre
    };
    
    setProveedores([newProveedor, ...proveedores]);
    
    // Select the created proveedor
    setNuevoArticulo({
      ...nuevoArticulo,
      proveedor_id: newProveedor.id,
      nombreProveedor: newProveedor.nombre,
    });
    setProveedorQuery(newProveedor.nombre);
  };

  const handleFilesChange = (files: File[]) => {
    setArchivos(files);
    form.setValue('archivos', files);
  };

  const onSubmit = async (data: FormValues) => {
    if (articulos.length === 0) {
      toast.error("Debe agregar al menos un artículo");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare articulos for database
      const articulosForDb: ArticuloRecaudo[] = articulos.map(articulo => ({
        proveedor_id: articulo.proveedor_id,
        descripcion: articulo.descripcion,
        cantidad: articulo.cantidad,
        valor_unitario: articulo.valor_unitario,
        valor_total: articulo.valor_total,
        tasa_iva: articulo.tasa_iva,
        valor_iva: articulo.valor_iva
      }));
      
      // Create recaudo with all required fields
      const { data: recaudoId, error } = await createRecaudo({
        cliente_id: data.cliente_id,
        monto: data.monto,
        subtotal: data.subtotal,
        iva: data.iva,
        total: data.total,
        metodo_pago: data.metodo_pago,
        fecha_pago: data.fecha_pago,
        fecha_vencimiento: data.fecha_vencimiento,
        estado: data.estado,
        notas: data.notas || "",
        articulos: articulosForDb,
        archivos: data.archivos
      });
      
      if (error) throw error;
      
      toast.success(`Recaudo ${nextRecaudoNumber} creado exitosamente`);
      
      setTimeout(() => {
        navigate("/recaudos");
      }, 1500);
    } catch (error: any) {
      toast.error(`Error al crear recaudo: ${error.message}`);
      console.error("Error creating recaudo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container pt-[var(--header-height)] overflow-y-auto">
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
                  Nuevo Recaudo {nextRecaudoNumber}
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
                            {form.formState.errors.cliente_id?.message}
                          </FormMessage>
                        </div>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="metodo_pago"
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
                        name="fecha_pago"
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
                        name="fecha_vencimiento"
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                value={nuevoArticulo.valor_unitario} 
                                onChange={(e) => setNuevoArticulo({...nuevoArticulo, valor_unitario: parseFloat(e.target.value) || 0})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="tasaIva">IVA</Label>
                              <Select 
                                value={nuevoArticulo.tasa_iva.toString()}
                                onValueChange={(value) => setNuevoArticulo({
                                  ...nuevoArticulo, 
                                  tasa_iva: parseFloat(value)
                                })}
                              >
                                <SelectTrigger id="tasaIva">
                                  <SelectValue placeholder="Seleccionar IVA" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tasasIVA.map((tasa) => (
                                    <SelectItem key={tasa.valor} value={tasa.valor.toString()}>
                                      {tasa.etiqueta}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-2">
                            <Button 
                              type="button" 
                              className="bg-teal hover:bg-sage text-white"
                              onClick={agregarArticulo}
                              disabled={!nuevoArticulo.proveedor_id || !nuevoArticulo.descripcion}
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
                                <TableHead className="text-right">IVA (%)</TableHead>
                                <TableHead className="text-right">Valor IVA</TableHead>
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
                                    ${articulo.valor_unitario.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {(articulo.tasa_iva * 100).toFixed(0)}%
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${articulo.valor_iva.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${articulo.valor_total.toLocaleString()}
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
                        
                        <FileUpload onFilesChange={handleFilesChange} />
                        
                        <div className="mt-4 space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Subtotal:</span>
                            <span>${form.watch('subtotal').toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total IVA:</span>
                            <span>${form.watch('iva').toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span>${form.watch('total').toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
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
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-teal hover:bg-sage text-white"
                        disabled={isLoading}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? "Guardando..." : "Guardar Recaudo"}
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
