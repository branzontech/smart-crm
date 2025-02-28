
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const empresaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  industria: z.string().min(2, "La industria es requerida"),
  empleados: z.string().min(1, "El número de empleados es requerido"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  direccion: z.string().min(5, "La dirección es requerida"),
  telefono: z.string().min(8, "El teléfono es requerido"),
  sitioWeb: z.string().url("Debe ser una URL válida").optional(),
  descripcion: z.string().optional(),
});

type EmpresaForm = z.infer<typeof empresaSchema>;

export default function NuevaEmpresa() {
  const navigate = useNavigate();
  const form = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
  });

  const onSubmit = async (data: EmpresaForm) => {
    try {
      console.log(data);
      toast.success("Empresa creada exitosamente");
      navigate("/empresas");
    } catch (error) {
      toast.error("Error al crear la empresa");
    }
  };

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
                onClick={() => navigate("/empresas")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>
            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl font-semibold">Nueva Empresa</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre de la Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="Empresa S.A." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="industria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industria</FormLabel>
                            <FormControl>
                              <Input placeholder="Tecnología, Manufactura, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="empleados"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Empleados</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="100" {...field} />
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
                              <Input placeholder="Buenos Aires" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dirección</FormLabel>
                            <FormControl>
                              <Input placeholder="Av. Principal 123" {...field} />
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
                              <Input placeholder="+54 11 1234-5678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sitioWeb"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sitio Web</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.empresa.com" {...field} />
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
                              placeholder="Breve descripción de la empresa..."
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
                        Crear Empresa
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
