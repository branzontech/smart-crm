
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cotizacionSchema = z.object({
  cliente: z.string().min(2, "El cliente es requerido"),
  numero: z.string().min(1, "El número de cotización es requerido"),
  monto: z.string().min(1, "El monto es requerido"),
  fechaEmision: z.string().min(1, "La fecha de emisión es requerida"),
  validezHasta: z.string().min(1, "La fecha de validez es requerida"),
  estado: z.string().min(1, "El estado es requerido"),
  notas: z.string().optional(),
});

type CotizacionForm = z.infer<typeof cotizacionSchema>;

export default function NuevaCotizacion() {
  const navigate = useNavigate();
  const form = useForm<CotizacionForm>({
    resolver: zodResolver(cotizacionSchema),
    defaultValues: {
      fechaEmision: new Date().toISOString().split('T')[0],
      estado: "Borrador"
    }
  });

  const onSubmit = async (data: CotizacionForm) => {
    try {
      console.log(data);
      toast.success("Cotización creada exitosamente");
      navigate("/ventas/cotizaciones");
    } catch (error) {
      toast.error("Error al crear la cotización");
    }
  };

  // Lista de clientes (normalmente vendría de una API)
  const clientes = [
    { id: 1, nombre: "Tech Solutions SA" },
    { id: 2, nombre: "Green Energy Corp" },
    { id: 3, nombre: "Global Logistics" },
    { id: 4, nombre: "Digital Systems Inc" },
  ];

  // Estados de cotización
  const estados = [
    { id: "borrador", nombre: "Borrador" },
    { id: "enviada", nombre: "Enviada" },
    { id: "aprobada", nombre: "Aprobada" },
    { id: "rechazada", nombre: "Rechazada" },
    { id: "expirada", nombre: "Expirada" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
                onClick={() => navigate("/ventas/cotizaciones")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl font-semibold">Nueva Cotización</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cliente"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un cliente" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clientes.map((cliente) => (
                                  <SelectItem key={cliente.id} value={cliente.id.toString()}>
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
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Cotización</FormLabel>
                            <FormControl>
                              <Input placeholder="COT-2024-001" {...field} />
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
                              <Input type="number" placeholder="10000" {...field} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un estado" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {estados.map((estado) => (
                                  <SelectItem key={estado.id} value={estado.id}>
                                    {estado.nombre}
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
                        name="fechaEmision"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha de Emisión</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="validezHasta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Válida Hasta</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
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
                              placeholder="Detalles adicionales de la cotización..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" className="bg-teal hover:bg-sage text-white">
                        <Save className="mr-2 h-4 w-4" />
                        Crear Cotización
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
}
