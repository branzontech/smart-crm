
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList } from "lucide-react";
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

const oportunidadSchema = z.object({
  cliente: z.string().min(2, "El cliente es requerido"),
  valor: z.string().min(1, "El valor es requerido"),
  etapa: z.string().min(1, "La etapa es requerida"),
  probabilidad: z.string().min(1, "La probabilidad es requerida"),
  fechaCierre: z.string().min(1, "La fecha de cierre es requerida"),
  descripcion: z.string().optional(),
});

type OportunidadForm = z.infer<typeof oportunidadSchema>;

export default function NuevaOportunidad() {
  const navigate = useNavigate();
  const form = useForm<OportunidadForm>({
    resolver: zodResolver(oportunidadSchema),
  });

  const onSubmit = async (data: OportunidadForm) => {
    try {
      console.log(data);
      toast.success("Oportunidad creada exitosamente");
      navigate("/ventas/oportunidades");
    } catch (error) {
      toast.error("Error al crear la oportunidad");
    }
  };

  const etapas = [
    "Prospección",
    "Calificación",
    "Necesidades",
    "Propuesta",
    "Negociación",
    "Cierre",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-auto pt-[calc(var(--header-height)+1rem)]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
              onClick={() => navigate("/ventas/oportunidades")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-teal" />
                <CardTitle className="text-xl sm:text-2xl font-semibold">Nueva Oportunidad</CardTitle>
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
                          <FormControl>
                            <Input placeholder="Nombre del cliente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="valor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="10000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="etapa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Etapa</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una etapa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {etapas.map((etapa) => (
                                <SelectItem key={etapa} value={etapa}>
                                  {etapa}
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
                      name="probabilidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Probabilidad (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              min="0"
                              max="100"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fechaCierre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Estimada de Cierre</FormLabel>
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
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detalles de la oportunidad..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="submit" 
                      className="bg-teal hover:bg-sage text-white w-full sm:w-auto"
                    >
                      Crear Oportunidad
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
