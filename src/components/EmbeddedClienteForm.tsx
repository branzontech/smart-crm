
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const clienteSimpleSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  documento: z.string().min(5, "El documento es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
});

type ClienteSimpleForm = z.infer<typeof clienteSimpleSchema>;

interface EmbeddedClienteFormProps {
  onClienteCreated?: (cliente: { id: number; nombre: string }) => void;
}

export function EmbeddedClienteForm({ onClienteCreated }: EmbeddedClienteFormProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ClienteSimpleForm>({
    resolver: zodResolver(clienteSimpleSchema),
    defaultValues: {
      nombre: "",
      documento: "",
      email: "",
      telefono: "",
    },
  });

  const goToFullClientForm = () => {
    setOpen(false);
    navigate("/clientes/nuevo");
  };

  const handleSubmit = (data: ClienteSimpleForm) => {
    // Simular la creación de un cliente
    // En un caso real, esto sería una llamada a la API
    const nuevoCliente = {
      id: Math.floor(Math.random() * 1000), // Simulado
      nombre: data.nombre.trim(),
    };

    if (onClienteCreated) {
      onClienteCreated(nuevoCliente);
    }
    
    toast.success("Cliente creado exitosamente");
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="text-teal hover:bg-[#FEF7CD] hover:text-teal"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del cliente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Documento *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Número de documento"
                        {...field}
                      />
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
                        placeholder="correo@ejemplo.com"
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
                      <Input
                        placeholder="Número de teléfono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                type="button"
                variant="link"
                className="text-teal hover:text-sage"
                onClick={goToFullClientForm}
              >
                Ir al formulario completo
              </Button>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#FEF7CD] hover:bg-[#FEF7CD]/80 text-teal"
              >
                Guardar Cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
