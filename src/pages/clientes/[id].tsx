import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Mail,
  Gift,
  Tag,
  Lightbulb,
  MessageSquare,
  User,
  Phone,
  Building,
  AtSign,
  PenSquare,
  Save,
  X,
  ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClienteTimeline } from "@/components/clientes/ClienteTimeline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  origen: z.enum(["referido", "web", "redes_sociales", "evento", "otro"]),
  presupuestoEstimado: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  ultimoContacto: z.string().optional(),
  intereses: z.array(z.string()).optional(),
});

type ClienteForm = z.infer<typeof clienteSchema>;

const sectores = [
  "Tecnología",
  "Salud",
  "Educación",
  "Manufactura",
  "Comercio",
  "Servicios",
  "Construcción",
  "Otro",
];

const tiposServicio = [
  "Desarrollo de software",
  "Consultoría tecnológica",
  "Diseño web",
  "Marketing digital",
  "Infraestructura y nube",
  "Ciberseguridad",
  "Soporte técnico",
  "Capacitación",
  "Análisis de datos",
  "Otro",
];

type Cliente = {
  id: number;
  tipoPersona: "natural" | "juridica";
  tipoDocumento: "CC" | "NIT" | "CE" | "pasaporte";
  documento: string;
  nombre: string;
  apellidos?: string;
  empresa?: string;
  cargo?: string;
  email: string;
  telefono: string;
  tipo: "potencial" | "activo" | "inactivo" | "recurrente" | "referido" | "suspendido" | "corporativo";
  tipoServicio: string;
  sector: string;
  direccion: string;
  ciudad: string;
  pais: string;
  notas?: string;
  origen: "referido" | "web" | "redes_sociales" | "evento" | "otro";
  presupuestoEstimado?: string;
  fechaNacimiento?: string;
  ultimoContacto?: string;
  intereses: string[];
};

const clienteEjemplo: Cliente = {
  id: 1,
  tipoPersona: "natural",
  tipoDocumento: "CC",
  documento: "1234567890",
  nombre: "Juan Pérez",
  apellidos: "González",
  empresa: "Empresa A",
  cargo: "Director",
  email: "juan@empresa-a.com",
  telefono: "1234567890",
  tipo: "activo",
  tipoServicio: "Consultoría tecnológica",
  sector: "Tecnología",
  direccion: "Calle Principal #123",
  ciudad: "Ciudad Ejemplo",
  pais: "País Ejemplo",
  notas: "Cliente frecuente",
  origen: "web",
  presupuestoEstimado: "50000",
  fechaNacimiento: "1990-05-15",
  ultimoContacto: "2024-03-20",
  intereses: ["Tecnología", "Innovación", "Sostenibilidad"],
};

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente>(clienteEjemplo);
  const [mensaje, setMensaje] = useState("");
  const [asunto, setAsunto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newInteres, setNewInteres] = useState("");
  const clienteId = parseInt(id || "1");

  const form = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipoPersona: cliente.tipoPersona,
      tipoDocumento: cliente.tipoDocumento,
      documento: cliente.documento,
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      empresa: cliente.empresa,
      cargo: cliente.cargo,
      email: cliente.email,
      telefono: cliente.telefono,
      tipo: cliente.tipo,
      tipoServicio: cliente.tipoServicio,
      sector: cliente.sector,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      pais: cliente.pais,
      notas: cliente.notas,
      origen: cliente.origen,
      presupuestoEstimado: cliente.presupuestoEstimado,
      fechaNacimiento: cliente.fechaNacimiento,
      ultimoContacto: cliente.ultimoContacto,
      intereses: cliente.intereses,
    }
  });

  const tipoPersona = form.watch("tipoPersona");

  useEffect(() => {
    form.reset({
      tipoPersona: cliente.tipoPersona,
      tipoDocumento: cliente.tipoDocumento,
      documento: cliente.documento,
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      empresa: cliente.empresa,
      cargo: cliente.cargo,
      email: cliente.email,
      telefono: cliente.telefono,
      tipo: cliente.tipo,
      tipoServicio: cliente.tipoServicio,
      sector: cliente.sector,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      pais: cliente.pais,
      notas: cliente.notas,
      origen: cliente.origen,
      presupuestoEstimado: cliente.presupuestoEstimado,
      fechaNacimiento: cliente.fechaNacimiento,
      ultimoContacto: cliente.ultimoContacto,
      intereses: cliente.intereses,
    });
  }, [cliente, form]);

  const handleEnviarComunicacion = (tipo: string) => {
    toast({
      title: "Comunicación enviada",
      description: `Se ha enviado ${tipo} a ${cliente.nombre}`,
    });
    setMensaje("");
    setAsunto("");
  };

  const handleSaveChanges = (data: ClienteForm) => {
    setCliente({ 
      ...cliente, 
      ...data,
      intereses: data.intereses || [] 
    });
    setIsEditing(false);
    toast({
      title: "Datos actualizados",
      description: "La información del cliente ha sido actualizada correctamente.",
    });
  };

  const handleAddInteres = () => {
    if (newInteres.trim() && cliente.intereses && !cliente.intereses.includes(newInteres.trim())) {
      const updatedIntereses = [...cliente.intereses, newInteres.trim()];
      setCliente({ ...cliente, intereses: updatedIntereses });
      form.setValue("intereses", updatedIntereses);
      setNewInteres("");
    }
  };

  const handleRemoveInteres = (interes: string) => {
    if (cliente.intereses) {
      const updatedIntereses = cliente.intereses.filter(i => i !== interes);
      setCliente({ ...cliente, intereses: updatedIntereses });
      form.setValue("intereses", updatedIntereses);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      form.reset({
        tipoPersona: cliente.tipoPersona,
        tipoDocumento: cliente.tipoDocumento,
        documento: cliente.documento,
        nombre: cliente.nombre,
        apellidos: cliente.apellidos,
        empresa: cliente.empresa,
        cargo: cliente.cargo,
        email: cliente.email,
        telefono: cliente.telefono,
        tipo: cliente.tipo,
        tipoServicio: cliente.tipoServicio,
        sector: cliente.sector,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        pais: cliente.pais,
        notas: cliente.notas,
        origen: cliente.origen,
        presupuestoEstimado: cliente.presupuestoEstimado,
        fechaNacimiento: cliente.fechaNacimiento,
        ultimoContacto: cliente.ultimoContacto,
        intereses: cliente.intereses,
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container pt-[var(--header-height)] overflow-y-auto">
          <div className="max-w-content">
            <div className="mb-6">
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
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-semibold text-gray-900">
                    {!isEditing ? cliente.nombre : "Editar Cliente"}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button 
                        className="bg-teal hover:bg-sage"
                        onClick={toggleEditMode}
                      >
                        <PenSquare className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    ) : null}
                    <Button className="bg-teal hover:bg-sage">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Información Personal</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span><strong>Nombre:</strong> {cliente.nombre} {cliente.apellidos}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4" />
                          <span><strong>Empresa:</strong> {cliente.empresa}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <AtSign className="h-4 w-4" />
                          <span><strong>Email:</strong> {cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span><strong>Teléfono:</strong> {cliente.telefono}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 mt-1" />
                          <div>
                            <strong>Fecha de Nacimiento:</strong><br />
                            {cliente.fechaNacimiento || "No especificada"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Información Comercial</h3>
                      <div className="space-y-2">
                        <p><strong>Tipo de Cliente:</strong> {cliente.tipo}</p>
                        <p><strong>Tipo de Servicio:</strong> {cliente.tipoServicio}</p>
                        <p><strong>Sector:</strong> {cliente.sector}</p>
                        <p><strong>Origen:</strong> {cliente.origen}</p>
                        <p><strong>Presupuesto:</strong> {cliente.presupuestoEstimado || "No especificado"}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Dirección</h3>
                      <div className="space-y-2">
                        <p><strong>Dirección:</strong> {cliente.direccion}</p>
                        <p><strong>Ciudad:</strong> {cliente.ciudad}</p>
                        <p><strong>País:</strong> {cliente.pais}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Intereses</h3>
                      <div className="flex flex-wrap gap-2">
                        {cliente.intereses && cliente.intereses.map((interes, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                          >
                            {interes}
                          </span>
                        ))}
                      </div>
                    </div>
                    {cliente.notas && (
                      <div className="col-span-1 md:col-span-2">
                        <h3 className="font-semibold mb-3">Notas</h3>
                        <p className="text-gray-600">{cliente.notas}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSaveChanges)}
                      className="space-y-6"
                    >
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

                          {tipoPersona === "natural" && (
                            <FormField
                              control={form.control}
                              name="fechaNacimiento"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fecha de Nacimiento</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

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
                                      <SelectItem key={sector} value={sector}>
                                        {sector}
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
                                      <SelectItem key={servicio} value={servicio}>
                                        {servicio}
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
                          name="ciudad"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormControl>
                                <Input placeholder="Ciudad" {...field} />
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
                              <FormControl>
                                <Input placeholder="País" {...field} />
                              </FormControl>
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
                                  <SelectItem value="referido">Referido</SelectItem>
                                  <SelectItem value="web">Sitio Web</SelectItem>
                                  <SelectItem value="redes_sociales">
                                    Redes Sociales
                                  </SelectItem>
                                  <SelectItem value="evento">Evento</SelectItem>
                                  <SelectItem value="otro">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

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
                          onClick={toggleEditMode}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-teal hover:bg-sage">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            {!isEditing && (
              <Tabs defaultValue="comunicaciones" className="w-full mt-6">
                <TabsList>
                  <TabsTrigger value="comunicaciones">Comunicaciones</TabsTrigger>
                  <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="comunicaciones" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-blue-500" />
                              Enviar Recordatorio
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            Programa recordatorios personalizados para seguimiento.
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Recordatorio</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Asunto</Label>
                            <Input
                              value={asunto}
                              onChange={(e) => setAsunto(e.target.value)}
                              placeholder="Asunto del recordatorio"
                            />
                          </div>
                          <div>
                            <Label>Mensaje</Label>
                            <Textarea
                              value={mensaje}
                              onChange={(e) => setMensaje(e.target.value)}
                              placeholder="Escribe el mensaje del recordatorio..."
                            />
                          </div>
                          <Button 
                            className="w-full bg-teal hover:bg-sage"
                            onClick={() => handleEnviarComunicacion("recordatorio")}
                          >
                            Enviar Recordatorio
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Tag className="h-5 w-5 text-green-500" />
                              Enviar Promoción
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            Comparte ofertas y promociones especiales.
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Promoción</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Asunto</Label>
                            <Input
                              value={asunto}
                              onChange={(e) => setAsunto(e.target.value)}
                              placeholder="Asunto de la promoción"
                            />
                          </div>
                          <div>
                            <Label>Mensaje</Label>
                            <Textarea
                              value={mensaje}
                              onChange={(e) => setMensaje(e.target.value)}
                              placeholder="Describe la promoción..."
                            />
                          </div>
                          <Button 
                            className="w-full bg-teal hover:bg-sage"
                            onClick={() => handleEnviarComunicacion("promoción")}
                          >
                            Enviar Promoción
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Gift className="h-5 w-5 text-pink-500" />
                              Felicitación
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            Envía felicitaciones de cumpleaños y fechas especiales.
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Felicitación</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Asunto</Label>
                            <Input
                              value={asunto}
                              onChange={(e) => setAsunto(e.target.value)}
                              placeholder="Asunto de la felicitación"
                            />
                          </div>
                          <div>
                            <Label>Mensaje</Label>
                            <Textarea
                              value={mensaje}
                              onChange={(e) => setMensaje(e.target.value)}
                              placeholder="Escribe tu mensaje de felicitación..."
                            />
                          </div>
                          <Button 
                            className="w-full bg-teal hover:bg-sage"
                            onClick={() => handleEnviarComunicacion("felicitación")}
                          >
                            Enviar Felicitación
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Lightbulb className="h-5 w-5 text-yellow-500" />
                              Tips y Consejos
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            Comparte consejos útiles y mejores prácticas.
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Tip</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Asunto</Label>
                            <Input
                              value={asunto}
                              onChange={(e) => setAsunto(e.target.value)}
                              placeholder="Asunto del tip"
                            />
                          </div>
                          <div>
                            <Label>Mensaje</Label>
                            <Textarea
                              value={mensaje}
                              onChange={(e) => setMensaje(e.target.value)}
                              placeholder="Escribe el tip o consejo..."
                            />
                          </div>
                          <Button 
                            className="w-full bg-teal hover:bg-sage"
                            onClick={() => handleEnviarComunicacion("tip")}
                          >
                            Enviar Tip
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Mail className="h-5 w-5 text-purple-500" />
                              Newsletter
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            Envía actualizaciones y noticias relevantes.
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enviar Newsletter</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Asunto</Label>
                            <Input
                              value={asunto}
                              onChange={(e) => setAsunto(e.target.value)}
                              placeholder="Asunto del newsletter"
                            />
                          </div>
                          <div>
                            <Label>Mensaje</Label>
                            <Textarea
                              value={mensaje}
                              onChange={(e) => setMensaje(e.target.value)}
                              placeholder="Contenido del newsletter..."
                            />
                          </div>
                          <Button 
                            className="w-full bg-teal hover:bg-sage"
                            onClick={() => handleEnviarComunicacion("newsletter")}
                          >
                            Enviar Newsletter
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TabsContent>

                <TabsContent value="seguimiento">
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">Información de Contacto</h3>
                          <div className="space-y-2">
                            <p><span className="text-gray-600">Último contacto:</span> {cliente.ultimoContacto || "No registrado"}</p>
                            <p><span className="text-gray-600">Fecha de nacimiento:</span> {cliente.fechaNacimiento || "No registrada"}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Intereses</h3>
                          <div className="flex flex-wrap gap-2">
                            {cliente.intereses && cliente.intereses.map((interes, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                              >
                                {interes}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="historial">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Línea de Tiempo</h3>
                    <ClienteTimeline clienteId={clienteId} />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
