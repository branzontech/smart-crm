import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface MaestroFormProps {
  initialData?: {
    id?: string;
    nombre?: string;
    descripcion?: string;
    codigo?: number;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  tipo: "sector" | "tipoServicio" | "pais" | "origenCliente";
  includeCodigo?: boolean;
}

const formSchema = (includeCodigo: boolean) => {
  const baseSchema = {
    id: z.string().optional(),
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    descripcion: z.string().optional(),
  };

  if (includeCodigo) {
    return z.object({
      ...baseSchema,
      codigo: z.number().optional().or(z.string().transform(val => val === "" ? undefined : parseInt(val, 10))),
    });
  }

  return z.object(baseSchema);
};

export function MaestroForm({ initialData, onSubmit, onCancel, tipo, includeCodigo = false }: MaestroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema(includeCodigo)),
    defaultValues: {
      id: initialData?.id || undefined,
      nombre: initialData?.nombre || "",
      descripcion: initialData?.descripcion || "",
      ...(includeCodigo && { codigo: initialData?.codigo || "" }),
    },
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(data)
          .filter(([key, value]) => {
            if (key === 'id') {
              return value !== "" && value !== undefined;
            }
            return true;
          })
      );
      
      await onSubmit(cleanedData);
      toast.success("Datos guardados correctamente");
    } catch (error: any) {
      toast.error(`Error al guardar: ${error.message}`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitulo = () => {
    const esNuevo = !initialData?.id;
    switch (tipo) {
      case "sector":
        return esNuevo ? "Nuevo Sector" : "Editar Sector";
      case "tipoServicio":
        return esNuevo ? "Nuevo Tipo de Servicio" : "Editar Tipo de Servicio";
      case "pais":
        return esNuevo ? "Nuevo País" : "Editar País";
      case "origenCliente":
        return esNuevo ? "Nuevo Origen de Cliente" : "Editar Origen de Cliente";
      default:
        return esNuevo ? "Nuevo" : "Editar";
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-semibold">{getTitulo()}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {includeCodigo && (
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Código" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descripción (opcional)" 
                    className="resize-none" 
                    rows={3}
                    {...field} 
                  />
                </FormControl>
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
