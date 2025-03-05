
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
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
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ClienteTimeline } from "@/components/clientes/ClienteTimeline";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";

type Cliente = {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  ultimoContacto: string;
  intereses: string[];
};

const clienteEjemplo: Cliente = {
  id: 1,
  nombre: "Juan Pérez",
  empresa: "Empresa A",
  email: "juan@empresa-a.com",
  telefono: "+1234567890",
  fechaNacimiento: "1990-05-15",
  ultimoContacto: "2024-03-20",
  intereses: ["Tecnología", "Innovación", "Sostenibilidad"],
};

export default function ClienteDetalle() {
  const { id } = useParams();
  const { toast } = useToast();
  const [cliente, setCliente] = useState<Cliente>(clienteEjemplo);
  const [mensaje, setMensaje] = useState("");
  const [asunto, setAsunto] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newInteres, setNewInteres] = useState("");
  const clienteId = parseInt(id || "1");

  const form = useForm<Cliente>({
    defaultValues: cliente
  });

  const handleEnviarComunicacion = (tipo: string) => {
    toast({
      title: "Comunicación enviada",
      description: `Se ha enviado ${tipo} a ${cliente.nombre}`,
    });
    setMensaje("");
    setAsunto("");
  };

  const handleSaveChanges = (data: Cliente) => {
    setCliente({ ...data, id: clienteId });
    setIsEditing(false);
    toast({
      title: "Datos actualizados",
      description: "La información del cliente ha sido actualizada correctamente.",
    });
  };

  const handleAddInteres = () => {
    if (newInteres.trim() && !cliente.intereses.includes(newInteres.trim())) {
      const updatedIntereses = [...cliente.intereses, newInteres.trim()];
      setCliente({ ...cliente, intereses: updatedIntereses });
      form.setValue("intereses", updatedIntereses);
      setNewInteres("");
    }
  };

  const handleRemoveInteres = (interes: string) => {
    const updatedIntereses = cliente.intereses.filter(i => i !== interes);
    setCliente({ ...cliente, intereses: updatedIntereses });
    form.setValue("intereses", updatedIntereses);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      // Si estamos cancelando la edición, restauramos los valores originales
      form.reset(cliente);
    } else {
      // Si estamos comenzando a editar, establecemos los valores actuales
      form.reset(cliente);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-start">
            <div>
              {!isEditing ? (
                <>
                  <h1 className="text-2xl font-semibold text-gray-900">{cliente.nombre}</h1>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span>{cliente.empresa}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <AtSign className="h-4 w-4" />
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{cliente.telefono}</span>
                    </div>
                  </div>
                </>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveChanges)} className="space-y-4 max-w-md">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Empresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                            <Input {...field} type="email" />
                          </FormControl>
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
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fechaNacimiento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Nacimiento</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2 mt-4">
                      <Button 
                        type="submit" 
                        className="bg-teal hover:bg-sage"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={toggleEditMode}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
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

          <Tabs defaultValue="comunicaciones" className="w-full">
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
                      {!isEditing ? (
                        <div className="space-y-2">
                          <p><span className="text-gray-600">Último contacto:</span> {cliente.ultimoContacto}</p>
                          <p><span className="text-gray-600">Fecha de nacimiento:</span> {cliente.fechaNacimiento}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label>Último contacto</Label>
                            <Input 
                              type="date" 
                              value={form.getValues().ultimoContacto} 
                              onChange={(e) => form.setValue("ultimoContacto", e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Intereses</h3>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {cliente.intereses.map((interes, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center"
                              >
                                {interes}
                                <X 
                                  className="h-3 w-3 ml-1 cursor-pointer text-gray-500 hover:text-gray-800" 
                                  onClick={() => handleRemoveInteres(interes)}
                                />
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Nuevo interés"
                              value={newInteres}
                              onChange={(e) => setNewInteres(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddInteres()}
                            />
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={handleAddInteres}
                            >
                              Añadir
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {cliente.intereses.map((interes, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                              {interes}
                            </span>
                          ))}
                        </div>
                      )}
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
        </div>
      </main>
    </div>
  );
}
