
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPaises } from "@/services/maestrosService";
import { Pais } from "@/types/maestros";

interface CiudadFormProps {
  initialData?: {
    id?: string;
    nombre?: string;
    pais_id?: string;
    pais?: Pais;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  pais_id: z.string().min(1, { message: "El país es requerido" }),
});

export function CiudadForm({ initialData, onSubmit, onCancel }: CiudadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [isLoadingPaises, setIsLoadingPaises] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || "",
      nombre: initialData?.nombre || "",
      pais_id: initialData?.pais_id || "",
    },
  });

  useEffect(() => {
    const loadPaises = async () => {
      setIsLoadingPaises(true);
      try {
        const data = await fetchPaises();
        setPaises(data);
      } catch (error: any) {
        toast.error(`Error al cargar países: ${error.message}`);
        console.error(error);
      } finally {
        setIsLoadingPaises(false);
      }
    };

    loadPaises();
  }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success("Ciudad guardada correctamente");
    } catch (error: any) {
      toast.error(`Error al guardar: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const titulo = initialData?.id ? "Editar Ciudad" : "Nueva Ciudad";

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">{titulo}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pais_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>País</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoadingPaises}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paises.map((pais) => (
                      <SelectItem key={pais.id} value={pais.id}>
                        {pais.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
