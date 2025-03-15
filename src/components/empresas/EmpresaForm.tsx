
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchSectores, fetchCiudades } from "@/services/maestrosService";
import { Loader2 } from "lucide-react";

export const empresaSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  industria: z.string().min(1, "La industria es requerida"),
  empleados: z.string().min(1, "El número de empleados es requerido"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  direccion: z.string().min(5, "La dirección es requerida"),
  telefono: z.string().min(8, "El teléfono es requerido"),
  sitioWeb: z.string().url("Debe ser una URL válida").optional().or(z.literal('')),
  descripcion: z.string().optional().or(z.literal('')),
  periodoVencimientoFacturas: z.string().min(1, "El periodo de vencimiento es requerido"),
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;

const periodosVencimiento = [
  "15 días",
  "30 días",
  "45 días",
  "60 días",
  "90 días",
];

interface EmpresaFormProps {
  defaultValues?: Partial<EmpresaFormValues>;
  onSubmit: (data: EmpresaFormValues) => Promise<void>;
  submitButtonText?: string;
  onCancel?: () => void;
}

export function EmpresaForm({ 
  defaultValues, 
  onSubmit, 
  submitButtonText = "Guardar", 
  onCancel 
}: EmpresaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectores, setSectores] = useState<{id: string, nombre: string}[]>([]);
  const [ciudades, setCiudades] = useState<{id: string, nombre: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      nombre: "",
      industria: "",
      empleados: "",
      ciudad: "",
      direccion: "",
      telefono: "",
      sitioWeb: "",
      descripcion: "",
      periodoVencimientoFacturas: "30 días",
      ...defaultValues
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [sectoresData, ciudadesData] = await Promise.all([
          fetchSectores(),
          fetchCiudades()
        ]);
        
        setSectores(sectoresData);
        setCiudades(ciudadesData);
      } catch (error: any) {
        toast.error(`Error al cargar datos: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (data: EmpresaFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // El error ya se maneja en el componente padre
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-teal" />
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                <FormLabel>Industria (Sector)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un sector" />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una ciudad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ciudades.map((ciudad) => (
                      <SelectItem key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
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
          <FormField
            control={form.control}
            name="periodoVencimientoFacturas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Periodo de Vencimiento de Facturas</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un periodo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {periodosVencimiento.map((periodo) => (
                      <SelectItem key={periodo} value={periodo}>
                        {periodo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Este periodo se utilizará para calcular fechas de vencimiento y alertas
                </FormDescription>
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
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              className="mr-2"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-teal hover:bg-sage text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
