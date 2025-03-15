
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { fetchSectores, fetchPaises, fetchCiudades, fetchTiposServicios, fetchOrigenesCliente } from "@/services/maestrosService";
import { Sector, Pais, Ciudad, TipoServicio, OrigenCliente } from "@/types/maestros";
import { createCliente, ClienteForm } from "@/services/clientesService";
import { fetchEmpresas, Empresa } from "@/services/empresaService";

const clienteSimpleSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  documento: z.string().min(5, "El documento es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefono: z.string().optional(),
  sector: z.string().min(2, "El sector es requerido"),
  pais: z.string().min(2, "El país es requerido"),
  ciudad: z.string().optional(),
  direccion: z.string().default("Por definir"),
  tipoServicio: z.string().optional(),
  origen: z.string().optional(),
  empresa: z.string().optional(),
  tipoPersona: z.enum(["natural", "juridica"]).default("natural"),
  tipoDocumento: z.enum(["CC", "NIT", "CE", "pasaporte"]).default("CC"),
  tipo: z.enum(["potencial", "activo", "inactivo", "recurrente", "referido", "suspendido", "corporativo"]).default("potencial"),
});

type ClienteSimpleForm = z.infer<typeof clienteSimpleSchema>;

interface EmbeddedClienteFormProps {
  onClienteCreated?: (cliente: { id: number; nombre: string }) => void;
  onCancel?: () => void;
}

export function EmbeddedClienteForm({ onClienteCreated, onCancel }: EmbeddedClienteFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [origenesCliente, setOrigenesCliente] = useState<OrigenCliente[]>([]);
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
      ciudad: "",
      direccion: "Por definir",
      tipoServicio: "",
      origen: "",
      empresa: "",
      tipoPersona: "natural",
      tipoDocumento: "CC",
      tipo: "potencial",
    },
  });

  // Cargar datos maestros al montar el componente
  useEffect(() => {
    const loadMaestros = async () => {
      setIsLoadingMaestros(true);
      try {
        const [sectoresData, paisesData, ciudadesData, tiposServicioData, origenesData, empresasData] = await Promise.all([
          fetchSectores(),
          fetchPaises(),
          fetchCiudades(),
          fetchTiposServicios(),
          fetchOrigenesCliente(),
          fetchEmpresas(),
        ]);
        
        setSectores(sectoresData);
        setPaises(paisesData);
        setCiudades(ciudadesData);
        setTiposServicio(tiposServicioData);
        setOrigenesCliente(origenesData);
        setEmpresas(empresasData);
      } catch (error) {
        console.error("Error al cargar datos maestros:", error);
        toast.error("Error al cargar datos de referencia");
      } finally {
        setIsLoadingMaestros(false);
      }
    };

    loadMaestros();
  }, []);

  // Filtrar ciudades cuando cambia el país seleccionado
  const paisId = form.watch("pais");
  useEffect(() => {
    if (paisId && ciudades.length > 0) {
      const filtradas = ciudades.filter(ciudad => ciudad.pais_id === paisId);
      setCiudadesFiltradas(filtradas);
      
      // Si ya hay una ciudad seleccionada y no está en el país actual, limpiar el campo
      const ciudadActual = form.getValues("ciudad");
      if (ciudadActual && !filtradas.some(c => c.id === ciudadActual)) {
        form.setValue("ciudad", "");
      }
    } else {
      setCiudadesFiltradas([]);
    }
  }, [paisId, ciudades, form]);

  const goToFullClientForm = () => {
    if (onCancel) onCancel();
    navigate("/clientes/nuevo");
  };

  const handleSubmit = async (data: ClienteSimpleForm) => {
    setIsLoading(true);
    try {
      // Convertir a formato completo para la API
      const clienteCompleto: ClienteForm = {
        tipoPersona: data.tipoPersona,
        tipoDocumento: data.tipoDocumento,
        documento: data.documento,
        nombre: data.nombre.trim(),
        email: data.email || "",
        telefono: data.telefono || "",
        tipo: data.tipo,
        sector: data.sector,
        pais: data.pais,
        ciudad: data.ciudad || data.pais, // Usamos el mismo país como ciudad si no se seleccionó
        tipoServicio: data.tipoServicio || "", 
        direccion: data.direccion || "Por definir",
        origen: data.origen || data.sector, // Usamos el sector como origen si no se seleccionó
        empresa: data.empresa || "", // Empresa seleccionada
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
      form.reset();
    } catch (error: any) {
      toast.error("Error al crear el cliente: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoadingMaestros ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">Cargando datos...</span>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoPersona"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo Persona *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="natural">Persona Natural</SelectItem>
                          <SelectItem value="juridica">Persona Jurídica</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipoDocumento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo Documento *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                          <SelectItem value="NIT">NIT</SelectItem>
                          <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                          <SelectItem value="pasaporte">Pasaporte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                name="ciudad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!paisId || ciudadesFiltradas.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !paisId 
                              ? "Selecciona primero un país" 
                              : ciudadesFiltradas.length === 0 
                                ? "No hay ciudades disponibles" 
                                : "Selecciona una ciudad"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ciudadesFiltradas.map((ciudad) => (
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
                name="tipoServicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Servicio</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo de servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposServicio.map((tipoServicio) => (
                          <SelectItem key={tipoServicio.id} value={tipoServicio.id}>
                            {tipoServicio.nombre}
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
                name="origen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen del Cliente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el origen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {origenesCliente.map((origen) => (
                          <SelectItem key={origen.id} value={origen.id}>
                            {origen.nombre}
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

              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dirección del cliente"
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
                onClick={onCancel}
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
    </>
  );
}
