
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Save, Loader2 } from "lucide-react";
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
import { getProveedorById, updateProveedor } from "@/services/proveedoresService";
import { useQuery } from "@tanstack/react-query";
import { fetchSectores } from "@/services/maestrosService";

const proveedorSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  tipo_documento: z.string().min(2, "El tipo de documento es requerido"),
  documento: z.string().min(5, "El documento es requerido"),
  contacto: z.string().min(7, "El número de contacto es requerido"),
  tipo_proveedor: z.string().min(2, "El tipo de proveedor es requerido"),
  sector_id: z.string().optional(),
  descripcion: z.string().optional(),
});

type ProveedorFormValues = z.infer<typeof proveedorSchema>;

export default function EditarProveedor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch sectors
  const { data: sectores = [], isLoading: isLoadingSectores } = useQuery({
    queryKey: ["sectores"],
    queryFn: fetchSectores,
  });
  
  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre: "",
      tipo_documento: "",
      documento: "",
      contacto: "",
      tipo_proveedor: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (id) {
      loadProveedor(id);
    }
  }, [id]);

  const loadProveedor = async (proveedorId: string) => {
    setIsLoading(true);
    try {
      const proveedor = await getProveedorById(proveedorId);
      
      form.reset({
        nombre: proveedor.nombre,
        tipo_documento: proveedor.tipo_documento,
        documento: proveedor.documento,
        contacto: proveedor.contacto,
        tipo_proveedor: proveedor.tipo_proveedor,
        sector_id: proveedor.sector_id,
        descripcion: proveedor.descripcion || "",
      });
    } catch (error: any) {
      toast.error(`Error al cargar el proveedor: ${error.message}`);
      console.error("Error loading proveedor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProveedorFormValues) => {
    if (!id) return;
    
    try {
      await updateProveedor(id, data);
      toast.success("Proveedor actualizado exitosamente");
      navigate(`/proveedores/${id}`);
    } catch (error: any) {
      console.error("Error updating proveedor:", error);
      toast.error(`Error al actualizar el proveedor: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <Navbar />
        <div className="main-container">
          <main className="flex-1 content-container">
            <div className="max-w-content flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-teal" />
              <span className="ml-2">Cargando datos del proveedor...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
                onClick={() => navigate(`/proveedores/${id}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a detalles
              </Button>
            </div>

            <Card>
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-teal" />
                  <CardTitle className="text-2xl">Editar Proveedor</CardTitle>
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
                        name="tipo_documento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Documento</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
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
                              value={field.value}
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
                      name="tipo_proveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Proveedor</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                      Guardar Cambios
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
