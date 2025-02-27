
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Gift, Tag, Lightbulb, MessageSquare, User, Phone, Building, AtSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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

// Datos de ejemplo - En un caso real, esto vendría de una base de datos
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
  const [cliente] = useState<Cliente>(clienteEjemplo);
  const [mensaje, setMensaje] = useState("");
  const [asunto, setAsunto] = useState("");

  const handleEnviarComunicacion = (tipo: string) => {
    // Aquí iría la lógica para enviar la comunicación
    toast({
      title: "Comunicación enviada",
      description: `Se ha enviado ${tipo} a ${cliente.nombre}`,
    });
    setMensaje("");
    setAsunto("");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Encabezado con información del cliente */}
          <div className="flex justify-between items-start">
            <div>
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
            </div>
            <Button className="bg-teal hover:bg-sage">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contactar
            </Button>
          </div>

          <Tabs defaultValue="comunicaciones" className="w-full">
            <TabsList>
              <TabsTrigger value="comunicaciones">Comunicaciones</TabsTrigger>
              <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="comunicaciones" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recordatorio */}
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

                {/* Promoción */}
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

                {/* Felicitación de cumpleaños */}
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

                {/* Tips y Consejos */}
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

                {/* Newsletter */}
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
                        <p><span className="text-gray-600">Último contacto:</span> {cliente.ultimoContacto}</p>
                        <p><span className="text-gray-600">Fecha de nacimiento:</span> {cliente.fechaNacimiento}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Intereses</h3>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historial">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Comunicaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Aquí iría el historial de comunicaciones */}
                    <p className="text-gray-600">No hay comunicaciones registradas.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
