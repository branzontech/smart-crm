
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createProveedor } from "@/services/proveedoresService";
import { useQuery } from "@tanstack/react-query";
import { fetchSectores } from "@/services/maestrosService";
import { Loader2 } from "lucide-react";

const proveedorSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  tipoDocumento: z.string().min(2, "El tipo de documento es requerido"),
  documento: z.string().min(5, "El documento es requerido"),
  contacto: z.string().min(7, "El número de contacto es requerido"),
  tipoProveedor: z.string().min(2, "El tipo de proveedor es requerido"),
  sector_id: z.string().optional(),
  descripcion: z.string().optional(),
});

type ProveedorForm = z.infer<typeof proveedorSchema>;

export default function NuevoProveedor() {
  const navigate = useNavigate();
  
  // Fetch sectors from the database
  const { data: sectores = [], isLoading: isLoadingSectores } = useQuery({
    queryKey: ["sectores"],
    queryFn: fetchSectores,
  });
  
  const form = useForm<ProveedorForm>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      tipoDocumento: "NIT",
      tipoProveedor: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data: ProveedorForm) => {
    try {
      // Map form data to database structure
      const proveedorData = {
        nombre: data.nombre,
        tipo_documento: data.tipoDocumento,
        documento: data.documento,
        contacto: data.contacto,
        tipo_proveedor: data.tipoProveedor,
        sector_id: data.sector_id,
        descripcion: data.descripcion,
      };
      
      await createProveedor(proveedorData);
      toast.success("Proveedor creado exitosamente");
      navigate("/proveedores");
    } catch (error: any) {
      console.error("Error creating provider:", error);
      toast.error(`Error al crear el proveedor: ${error.message}`);
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
                onClick={() => navigate("/proveedores")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>

            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl">Nuevo Proveedor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Proveedor</FormLabel>
                          <FormControl>
                            <Input placeholder="Empresa S.A." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tipoDocumento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Documento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione tipo de documento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                <SelectItem value="NIT">NIT</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="documento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Documento</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789-0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Contacto</FormLabel>
                            <FormControl>
                              <Input placeholder="+57 300 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sector_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sector</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={isLoadingSectores}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  {isLoadingSectores ? (
                                    <div className="flex items-center">
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Cargando sectores...
                                    </div>
                                  ) : (
                                    <SelectValue placeholder="Seleccione un sector" />
                                  )}
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectores.map((sector) => (
                                  <SelectItem key={sector.id} value={sector.id}>
                                    {sector.nombre}
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
                      name="tipoProveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Proveedor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione el tipo de industria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectores.map((sector) => (
                                <SelectItem key={sector.id} value={sector.nombre}>
                                  {sector.nombre}
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
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe brevemente al proveedor y sus servicios" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-teal hover:bg-sage">
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Proveedor
                    </Button>
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
