
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Coins } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FormLabel as Label } from "@/components/ui/form";
import { getClientes } from "@/services/clientesService";
import { getNextRecaudoNumber, createRecaudo } from "@/services/recaudos";
import { supabase } from "@/integrations/supabase/client";
import { ClienteSearchField } from "@/components/recaudos/ClienteSearchField";
import { ArticulosSection } from "@/components/recaudos/ArticulosSection";
import { formSchema, FormValues, metodosPago, estados } from "@/components/recaudos/recaudoFormSchema";
import { Articulo } from "@/components/recaudos/NuevoArticuloForm";

const NuevoRecaudo = () => {
  const navigate = useNavigate();
  const [nextRecaudoNumber, setNextRecaudoNumber] = useState("");
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [clienteQuery, setClienteQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

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

  const seleccionarCliente = (cliente: any) => {
    form.setValue('cliente_id', cliente.id);
    form.setValue('clienteNombre', cliente.nombre);
    setClienteQuery(cliente.nombre);
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
      const articulosForDb = articulos.map(articulo => ({
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
                        <Label>Cliente</Label>
                        <ClienteSearchField 
                          clienteQuery={clienteQuery}
                          setClienteQuery={setClienteQuery}
                          onSelectCliente={seleccionarCliente}
                          error={form.formState.errors.cliente_id?.message}
                        />
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
                    
                    <ArticulosSection 
                      articulos={articulos}
                      setArticulos={setArticulos}
                      watch={form.watch}
                      setValue={form.setValue}
                      onFilesChange={handleFilesChange}
                    />
                    
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
