
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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

const clienteSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  apellidos: z.string().min(2, "Los apellidos son requeridos"),
  empresa: z.string().min(2, "La empresa es requerida"),
  cargo: z.string().min(2, "El cargo es requerido"),
  email: z.string().email("Email inválido"),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  tipo: z.enum(["potencial", "activo", "inactivo"]),
  sector: z.string().min(2, "El sector es requerido"),
  direccion: z.string().min(5, "La dirección es requerida"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  pais: z.string().min(2, "El país es requerido"),
  notas: z.string().optional(),
  origen: z.enum(["referido", "web", "redes_sociales", "evento", "otro"]),
  presupuestoEstimado: z.string().optional(),
});

type ClienteForm = z.infer<typeof clienteSchema>;

const sectores = [
  "Tecnología",
  "Salud",
  "Educación",
  "Manufactura",
  "Comercio",
  "Servicios",
  "Construcción",
  "Otro",
];

export default function NuevoCliente() {
  const form = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipo: "potencial",
      origen: "web",
    },
  });

  const onSubmit = async (data: ClienteForm) => {
    try {
      // Aquí iría la lógica para guardar en la base de datos
      console.log(data);
      toast.success("Cliente guardado exitosamente");
      form.reset();
    } catch (error) {
      toast.error("Error al guardar el cliente");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Nuevo Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Personal */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="apellidos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                              <Input placeholder="Pérez González" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="juan@empresa.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Información Empresarial */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="empresa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="Empresa S.A." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <FormControl>
                              <Input placeholder="Director Comercial" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sector</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un sector" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectores.map((sector) => (
                                  <SelectItem key={sector} value={sector}>
                                    {sector}
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
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Cliente</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona el tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="potencial">Potencial</SelectItem>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="direccion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección</FormLabel>
                          <FormControl>
                            <Input placeholder="Calle Principal #123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ciudad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Ciudad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
                          <FormControl>
                            <Input placeholder="País" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="origen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origen del Cliente</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el origen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="referido">Referido</SelectItem>
                              <SelectItem value="web">Sitio Web</SelectItem>
                              <SelectItem value="redes_sociales">
                                Redes Sociales
                              </SelectItem>
                              <SelectItem value="evento">Evento</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Información Adicional */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="presupuestoEstimado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Presupuesto Estimado</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50000"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Presupuesto estimado en la moneda local
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas Adicionales</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Información adicional relevante sobre el cliente..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Guardar Cliente</Button>
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
