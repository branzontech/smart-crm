
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oportunidad, getOportunidadById, updateOportunidad } from "@/services/oportunidadesService";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface OportunidadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  oportunidadId: string | null;
  onUpdate: () => void;
}

export const OportunidadDrawer = ({ isOpen, onClose, oportunidadId, onUpdate }: OportunidadDrawerProps) => {
  const [oportunidad, setOportunidad] = useState<Oportunidad | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<Oportunidad>({
    defaultValues: {
      cliente: "",
      valor: 0,
      etapa: "prospecto",
      probabilidad: 0,
      fecha_cierre: "",
      descripcion: ""
    }
  });

  useEffect(() => {
    const fetchOportunidad = async () => {
      if (!oportunidadId) return;
      
      setIsLoading(true);
      try {
        const data = await getOportunidadById(oportunidadId);
        if (data) {
          setOportunidad(data);
          // Reformat date from YYYY-MM-DD to string for form input
          const formattedData = {
            ...data,
            fecha_cierre: data.fecha_cierre 
          };
          form.reset(formattedData);
        }
      } catch (error) {
        console.error("Error fetching oportunidad:", error);
        toast.error("No se pudo cargar la información de la oportunidad");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && oportunidadId) {
      fetchOportunidad();
    }
  }, [isOpen, oportunidadId, form]);

  const onSubmit = async (data: Oportunidad) => {
    if (!oportunidadId) return;
    
    setIsSaving(true);
    try {
      // Ensure numeric values are properly converted
      const formattedData = {
        ...data,
        valor: typeof data.valor === 'string' ? parseFloat(data.valor as string) : data.valor,
        probabilidad: typeof data.probabilidad === 'string' ? parseInt(data.probabilidad as string, 10) : data.probabilidad
      };
      
      const success = await updateOportunidad(oportunidadId, formattedData);
      if (success) {
        toast.success("Oportunidad actualizada correctamente");
        onUpdate();
        onClose();
      } else {
        toast.error("Error al actualizar la oportunidad");
      }
    } catch (error) {
      console.error("Error updating oportunidad:", error);
      toast.error("Error al actualizar la oportunidad");
    } finally {
      setIsSaving(false);
    }
  };

  const etapasOportunidad = [
    "prospecto",
    "contacto inicial",
    "propuesta enviada",
    "negociación",
    "cierre"
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh] max-h-[85vh] overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <div>
              <DrawerTitle className="text-xl">
                {isLoading ? "Cargando..." : oportunidad ? "Editar Oportunidad" : "Detalle de Oportunidad"}
              </DrawerTitle>
              <DrawerDescription>
                Actualiza la información de la oportunidad de venta
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <div className="p-4 pb-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="valor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
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
                              min="0" 
                              max="100" 
                              placeholder="0" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                            />
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar etapa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {etapasOportunidad.map((etapa) => (
                                <SelectItem key={etapa} value={etapa}>
                                  {etapa.charAt(0).toUpperCase() + etapa.slice(1)}
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
                      name="fecha_cierre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de cierre</FormLabel>
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
                            placeholder="Detalles de la oportunidad" 
                            className="min-h-[120px]" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DrawerFooter className="px-0">
                    <div className="flex justify-between w-full">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-teal hover:bg-sage" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <span className="animate-spin mr-2">●</span>
                            Guardando...
                          </>
                        ) : (
                          "Guardar cambios"
                        )}
                      </Button>
                    </div>
                  </DrawerFooter>
                </form>
              </Form>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
