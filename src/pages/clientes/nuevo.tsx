
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
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
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { fetchSectores, fetchTiposServicios, fetchPaises, fetchCiudades, fetchOrigenesCliente } from "@/services/maestrosService";
import { Sector, TipoServicio, Pais, Ciudad, OrigenCliente } from "@/types/maestros";
import { createCliente } from "@/services/clientesService";

const clienteSchema = z.object({
  tipoPersona: z.enum(["natural", "juridica"]),
  tipoDocumento: z.enum(["CC", "NIT", "CE", "pasaporte"]),
  documento: z.string().min(5, "El documento es requerido"),
  nombre: z.string().min(2, "El nombre es requerido"),
  apellidos: z.string().optional(),
  empresa: z.string().optional(),
  cargo: z.string().optional(),
  email: z.string().email("Email inválido"),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "Solo se permiten números"),
  tipo: z.enum(["potencial", "activo", "inactivo", "recurrente", "referido", "suspendido", "corporativo"]),
  tipoServicio: z.string().min(2, "El tipo de servicio es requerido"),
  sector: z.string().min(2, "El sector es requerido"),
  direccion: z.string().min(5, "La dirección es requerida"),
  ciudad: z.string().min(2, "La ciudad es requerida"),
  pais: z.string().min(2, "El país es requerido"),
  notas: z.string().optional(),
  origen: z.string().min(2, "El origen del cliente es requerido"),
  presupuestoEstimado: z.string().optional(),
});

type ClienteForm = z.infer<typeof clienteSchema>;

export default function NuevoCliente() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para almacenar los datos maestros
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [origenesCliente, setOrigenesCliente] = useState<OrigenCliente[]>([]);
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState<Ciudad[]>([]);
  const [isLoadingMaestros, setIsLoadingMaestros] = useState(true);

  const form = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipoPersona: "natural",
      tipoDocumento: "CC",
      tipo: "potencial",
      origen: "",
      apellidos: "",
      empresa: "",
      cargo: "",
      notas: "",
      presupuestoEstimado: "",
    },
  });

  // Cargar datos maestros al iniciar
  useEffect(() => {
    const loadMaestros = async () => {
      setIsLoadingMaestros(true);
      try {
        const [sectoresData, tiposServicioData, paisesData, ciudadesData, origenesData] = await Promise.all([
          fetchSectores(),
          fetchTiposServicios(),
          fetchPaises(),
          fetchCiudades(),
          fetchOrigenesCliente()
        ]);
        
        setSectores(sectoresData);
        setTiposServicio(tiposServicioData);
        setPaises(paisesData);
        setCiudades(ciudadesData);
        setOrigenesCliente(origenesData);
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
    if (paisId) {
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

  // Observar el tipo de persona para condicionar la UI
  const tipoPersona = form.watch("tipoPersona");

  const onSubmit = async (data: ClienteForm) => {
    setIsLoading(true);
    try {
      const result = await createCliente(data);
      
      if (result.error) {
        throw result.error;
      }
      
      toast.success("Cliente guardado exitosamente");
      navigate("/clientes");
    } catch (error: any) {
      toast.error("Error al guardar el cliente: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container pt-[var(--header-height)] overflow-y-auto">
          <div className="max-w-content">
            <div className="mb-6 mt-4">
              <Button
                variant="ghost"
                className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
                onClick={() => navigate("/clientes")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  Nuevo Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMaestros ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Cargando datos...</span>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      {/* Tipo de persona */}
                      <FormField
                        control={form.control}
                        name="tipoPersona"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Tipo de Persona</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="natural" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Persona Natural
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="juridica" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Persona Jurídica
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Documento */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="tipoDocumento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Documento</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Tipo de documento" />
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

                        <div className="md:col-span-2">
                          <FormField
                            control={form.control}
                            name="documento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Número de Documento</FormLabel>
                                <FormControl>
                                  <Input placeholder="1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Información Personal */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {tipoPersona === "natural" ? "Nombre" : "Razón Social"}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={tipoPersona === "natural" ? "Juan" : "Empresa S.A."} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {tipoPersona === "natural" && (
                            <FormField
                              control={form.control}
                              name="apellidos"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Apellidos</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Pérez González" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="juan@empresa.com"
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
                                  <Input placeholder="1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Información Empresarial */}
                        <div className="space-y-4">
                          {tipoPersona === "natural" && (
                            <>
                              <FormField
                                control={form.control}
                                name="empresa"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Empresa</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Empresa S.A." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="cargo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cargo</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Director Comercial" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}

                          <FormField
                            control={form.control}
                            name="sector"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sector</FormLabel>
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
                            name="tipoServicio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Servicio</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona un servicio" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {tiposServicio.map((servicio) => (
                                      <SelectItem key={servicio.id} value={servicio.id}>
                                        {servicio.nombre}
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
                            name="tipo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estado del Cliente</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona el estado" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="potencial">Potencial</SelectItem>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                    <SelectItem value="recurrente">Recurrente</SelectItem>
                                    <SelectItem value="referido">Referido</SelectItem>
                                    <SelectItem value="suspendido">Suspendido</SelectItem>
                                    <SelectItem value="corporativo">Corporativo</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Dirección */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="direccion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input placeholder="Calle Principal #123" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="pais"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>País</FormLabel>
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
                                defaultValue={field.value}
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
                          name="origen"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origen del Cliente</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
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
                      </div>

                      {/* Información Adicional */}
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="presupuestoEstimado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Presupuesto Estimado</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="50000"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Presupuesto estimado en la moneda local
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="notas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Notas Adicionales</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Información adicional relevante sobre el cliente..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate("/clientes")}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Guardar Cliente
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
