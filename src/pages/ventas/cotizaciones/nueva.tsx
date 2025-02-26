
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Printer,
  Save,
  Send,
} from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const cotizacionSchema = z.object({
  // Sección 1: Datos de la empresa
  nombreEmpresa: z.string().min(2, "El nombre es requerido"),
  descripcionEmpresa: z.string().min(10, "La descripción es requerida"),
  serviciosEmpresa: z.string().min(10, "Los servicios son requeridos"),
  
  // Sección 2: Propuesta
  clienteNombre: z.string().min(2, "El nombre del cliente es requerido"),
  saludo: z.string().min(10, "El saludo es requerido"),
  descripcionPropuesta: z.string().min(10, "La descripción es requerida"),
  valorPropuesta: z.string().min(1, "El valor es requerido"),
  
  // Sección 3: Datos de contacto
  nombreContacto: z.string().min(2, "El nombre de contacto es requerido"),
  emailContacto: z.string().email("Email inválido"),
  telefonoContacto: z.string().min(8, "Teléfono inválido"),
  paginaWeb: z.string().url("URL inválida"),
});

type CotizacionForm = z.infer<typeof cotizacionSchema>;

export default function NuevaCotizacion() {
  const navigate = useNavigate();
  const form = useForm<CotizacionForm>({
    resolver: zodResolver(cotizacionSchema),
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

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    // Implementar lógica de envío por email
    toast.success("Cotización enviada por email");
  };

  const handleWhatsApp = () => {
    // Implementar lógica de envío por WhatsApp
    toast.success("Cotización enviada por WhatsApp");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
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

          <Card className="mb-6">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl font-semibold">Nueva Cotización</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-teal hover:text-sage"
                    onClick={handlePrint}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    className="text-teal hover:text-sage"
                    onClick={handleEmail}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                  <Button
                    variant="outline"
                    className="text-teal hover:text-sage"
                    onClick={handleWhatsApp}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="empresa" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="empresa">
                        <Building2 className="mr-2 h-4 w-4" />
                        Datos de Empresa
                      </TabsTrigger>
                      <TabsTrigger value="propuesta">
                        <FileText className="mr-2 h-4 w-4" />
                        Propuesta
                      </TabsTrigger>
                      <TabsTrigger value="contacto">
                        <Phone className="mr-2 h-4 w-4" />
                        Contacto
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="empresa" className="space-y-4">
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="nombreEmpresa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre de la Empresa</FormLabel>
                              <FormControl>
                                <Input placeholder="Tu Empresa S.A." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="descripcionEmpresa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reseña Histórica</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Historia y trayectoria de la empresa..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="serviciosEmpresa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Servicios Ofrecidos</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descripción de servicios..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="propuesta" className="space-y-4">
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="clienteNombre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del Cliente</FormLabel>
                              <FormControl>
                                <Input placeholder="Cliente S.A." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="saludo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Saludo y Presentación</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Estimado cliente..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="descripcionPropuesta"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción de la Propuesta</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Detalle de servicios a cotizar..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="valorPropuesta"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Total (sin IVA)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="10000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="contacto" className="space-y-4">
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="nombreContacto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre del Contacto</FormLabel>
                              <FormControl>
                                <Input placeholder="Juan Pérez" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emailContacto"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="juan@empresa.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="telefonoContacto"
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
                          name="paginaWeb"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Página Web</FormLabel>
                              <FormControl>
                                <Input placeholder="https://www.empresa.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-2">
                    <Button type="submit" className="bg-teal hover:bg-sage text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cotización
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
