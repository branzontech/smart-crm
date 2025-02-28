
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Coins, BanknoteIcon, Plus, Trash2 } from "lucide-react";
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

// Esquema para los artículos
const articuloSchema = z.object({
  id: z.string().optional(),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser mayor a 0" }),
  valorUnitario: z.number().min(0, { message: "El valor unitario debe ser mayor o igual a 0" }),
  valorTotal: z.number().min(0, { message: "El valor total debe ser mayor o igual a 0" }),
});

// Esquema de validación para el formulario principal
const formSchema = z.object({
  cliente: z.string().min(1, { message: "Seleccione un cliente" }),
  proveedor: z.string().min(1, { message: "Seleccione un proveedor" }),
  factura: z.string().min(1, { message: "Ingrese el número de factura" }),
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
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [nuevoArticulo, setNuevoArticulo] = useState<{
    descripcion: string;
    cantidad: number;
    valorUnitario: number;
  }>({
    descripcion: "",
    cantidad: 1,
    valorUnitario: 0,
  });
  
  // Lista de clientes (normalmente vendría de una API)
  const clientes = [
    { id: 1, nombre: "Tech Solutions SA" },
    { id: 2, nombre: "Green Energy Corp" },
    { id: 3, nombre: "Global Logistics" },
    { id: 4, nombre: "Digital Systems Inc" },
    { id: 5, nombre: "Smart Solutions" },
  ];
  
  // Lista de proveedores
  const proveedores = [
    { id: 1, nombre: "ProveedorTech SA" },
    { id: 2, nombre: "Insumos Digitales" },
    { id: 3, nombre: "Servicios Globales" },
    { id: 4, nombre: "Componentes XYZ" },
    { id: 5, nombre: "Tecnología Avanzada" },
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
  
  // Configurar el formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      proveedor: "",
      factura: "",
      monto: "",
      subtotal: 0,
      iva: 0,
      total: 0,
      metodoPago: "",
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
    if (!nuevoArticulo.descripcion) {
      toast.error("La descripción del artículo es requerida");
      return;
    }
    
    const valorTotal = nuevoArticulo.cantidad * nuevoArticulo.valorUnitario;
    const articulo: Articulo = {
      id: `art-${Date.now()}`,
      descripcion: nuevoArticulo.descripcion,
      cantidad: nuevoArticulo.cantidad,
      valorUnitario: nuevoArticulo.valorUnitario,
      valorTotal,
    };
    
    const nuevosArticulos = [...articulos, articulo];
    setArticulos(nuevosArticulos);
    
    // Resetear el formulario de nuevo artículo
    setNuevoArticulo({
      descripcion: "",
      cantidad: 1,
      valorUnitario: 0,
    });
    
    // Actualizar totales
    setTimeout(() => calcularTotales(), 0);
  };
  
  // Eliminar un artículo de la lista
  const eliminarArticulo = (id: string) => {
    const nuevosArticulos = articulos.filter(articulo => articulo.id !== id);
    setArticulos(nuevosArticulos);
    setTimeout(() => calcularTotales(), 0);
  };
  
  const onSubmit = (data: FormValues) => {
    if (articulos.length === 0) {
      toast.error("Debe agregar al menos un artículo");
      return;
    }
    
    const recaudoCompleto = {
      ...data,
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
                  Nuevo Recaudo
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
                      <FormField
                        control={form.control}
                        name="cliente"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clientes.map((cliente) => (
                                  <SelectItem 
                                    key={cliente.id} 
                                    value={cliente.id.toString()}
                                  >
                                    {cliente.nombre}
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
                        name="proveedor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Proveedor</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar proveedor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {proveedores.map((proveedor) => (
                                  <SelectItem 
                                    key={proveedor.id} 
                                    value={proveedor.id.toString()}
                                  >
                                    {proveedor.nombre}
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
                        name="factura"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Factura</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: FAC-2023-001" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                        <CardTitle className="text-lg">Artículos o Servicios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div className="col-span-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Input 
                              id="descripcion"
                              placeholder="Descripción del artículo o servicio" 
                              value={nuevoArticulo.descripcion} 
                              onChange={(e) => setNuevoArticulo({...nuevoArticulo, descripcion: e.target.value})}
                            />
                          </div>
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
                          <div className="col-span-1 md:col-span-4 flex justify-end mt-2">
                            <Button 
                              type="button" 
                              className="bg-teal hover:bg-sage text-white"
                              onClick={agregarArticulo}
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
