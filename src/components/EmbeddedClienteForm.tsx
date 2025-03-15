
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
import { Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchSectores, fetchPaises } from "@/services/maestrosService";
import { Sector, Pais } from "@/types/maestros";
import { createCliente, ClienteForm } from "@/services/clientesService";
import { fetchEmpresas, Empresa } from "@/services/empresaService";

const clienteSimpleSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  documento: z.string().min(5, "El documento es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  sector: z.string().min(2, "El sector es requerido"),
  pais: z.string().min(2, "El país es requerido"),
  empresa: z.string().optional(),
});

type ClienteSimpleForm = z.infer<typeof clienteSimpleSchema>;

interface EmbeddedClienteFormProps {
  onClienteCreated?: (cliente: { id: number; nombre: string }) => void;
}

export function EmbeddedClienteForm({ onClienteCreated }: EmbeddedClienteFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoadingMaestros, setIsLoadingMaestros] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ClienteSimpleForm>({
    resolver: zodResolver(clienteSimpleSchema),
    defaultValues: {
      nombre: "",
      documento: "",
      email: "",
      telefono: "",
      sector: "",
      pais: "",
      empresa: "",
    },
  });

  // Cargar datos maestros al abrir el formulario
  useEffect(() => {
    if (open) {
      const loadMaestros = async () => {
        setIsLoadingMaestros(true);
        try {
          const [sectoresData, paisesData, empresasData] = await Promise.all([
            fetchSectores(),
            fetchPaises(),
            fetchEmpresas(),
          ]);
          
          setSectores(sectoresData);
          setPaises(paisesData);
          setEmpresas(empresasData);
        } catch (error) {
          console.error("Error al cargar datos maestros:", error);
          toast.error("Error al cargar datos de referencia");
        } finally {
          setIsLoadingMaestros(false);
        }
      };

      loadMaestros();
    }
  }, [open]);

  const goToFullClientForm = () => {
    setOpen(false);
    navigate("/clientes/nuevo");
  };

  const handleSubmit = async (data: ClienteSimpleForm) => {
    setIsLoading(true);
    try {
      // Convertir a formato completo para la API
      const clienteCompleto: ClienteForm = {
        tipoPersona: "natural" as const,
        tipoDocumento: "CC",
        documento: data.documento,
        nombre: data.nombre.trim(),
        email: data.email || "",
        telefono: data.telefono || "",
        tipo: "potencial",
        sector: data.sector,
        pais: data.pais,
        tipoServicio: "", // Estos campos son requeridos por el esquema
        direccion: "Por definir", // Valores por defecto
        ciudad: data.pais, // Usamos el mismo país como ciudad temporalmente
        origen: data.sector, // Usamos el sector como origen temporalmente
        empresa: data.empresa, // Usamos la empresa seleccionada
      };

      const result = await createCliente(clienteCompleto);
      
      if (result.error) {
        throw result.error;
      }

      if (result.data && onClienteCreated) {
        onClienteCreated({
          id: Number(result.data.id),
          nombre: result.data.nombre,
        });
      }
      
      toast.success("Cliente creado exitosamente");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error("Error al crear el cliente: " + error.message);
    } finally {
      setIsLoading(false);
    }
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
        {isLoadingMaestros ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Cargando datos...</span>
          </div>
        ) : (
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
                  name="empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa.id} value={empresa.id}>
                              {empresa.nombre}
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
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector *</FormLabel>
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
                  name="pais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un país" />
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
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
