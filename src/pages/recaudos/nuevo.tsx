
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Coins, BanknoteIcon } from "lucide-react";
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

// Esquema de validación para el formulario
const formSchema = z.object({
  cliente: z.string().min(1, { message: "Seleccione un cliente" }),
  factura: z.string().min(1, { message: "Ingrese el número de factura" }),
  monto: z.string().min(1, { message: "Ingrese el monto" }),
  metodoPago: z.string().min(1, { message: "Seleccione un método de pago" }),
  fechaPago: z.string().min(1, { message: "Seleccione una fecha de pago" }),
  estado: z.string().min(1, { message: "Seleccione un estado" }),
  notas: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NuevoRecaudo = () => {
  const navigate = useNavigate();
  
  // Lista de clientes (normalmente vendría de una API)
  const clientes = [
    { id: 1, nombre: "Tech Solutions SA" },
    { id: 2, nombre: "Green Energy Corp" },
    { id: 3, nombre: "Global Logistics" },
    { id: 4, nombre: "Digital Systems Inc" },
    { id: 5, nombre: "Smart Solutions" },
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
  
  // Configurar el formulario con React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente: "",
      factura: "",
      monto: "",
      metodoPago: "",
      fechaPago: new Date().toISOString().substring(0, 10),
      estado: "pendiente",
      notas: "",
    },
  });
  
  const onSubmit = (data: FormValues) => {
    console.log("Datos del formulario:", data);
    toast.success("Recaudo creado con éxito");
    
    // Normalmente aquí enviarías los datos a tu API
    // Después de guardar, redirigir a la lista de recaudos
    setTimeout(() => {
      navigate("/recaudos");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
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
            
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Información del Recaudo</CardTitle>
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
                        name="monto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <BanknoteIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input 
                                  {...field} 
                                  placeholder="0.00" 
                                  className="pl-10"
                                  type="number"
                                  step="0.01"
                                />
                              </div>
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
