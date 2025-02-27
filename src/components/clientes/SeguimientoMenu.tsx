
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  User,
  Mail,
  Calendar,
  Gift,
  Bell,
  Tag,
  MessageSquare,
} from "lucide-react";

interface Cliente {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  selected?: boolean;
}

export const SeguimientoMenu = () => {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([
    { id: 1, nombre: "Juan Pérez", empresa: "Empresa A", email: "juan@empresa-a.com" },
    { id: 2, nombre: "María García", empresa: "Empresa B", email: "maria@empresa-b.com" },
    { id: 3, nombre: "Carlos López", empresa: "Empresa C", email: "carlos@empresa-c.com" },
  ]);
  const [mensaje, setMensaje] = useState("");
  const [asunto, setAsunto] = useState("");

  const handleSelectCliente = (id: number) => {
    setClientes(clientes.map(cliente => 
      cliente.id === id ? { ...cliente, selected: !cliente.selected } : cliente
    ));
  };

  const handleSelectAll = () => {
    const allSelected = clientes.every(cliente => cliente.selected);
    setClientes(clientes.map(cliente => ({ ...cliente, selected: !allSelected })));
  };

  const getSelectedClientes = () => clientes.filter(cliente => cliente.selected);

  const handleEnviarComunicacion = (tipo: string) => {
    const selectedClientes = getSelectedClientes();
    if (selectedClientes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona al menos un cliente",
      });
      return;
    }

    toast({
      title: "Comunicación enviada",
      description: `Se ha enviado ${tipo} a ${selectedClientes.length} cliente(s)`,
    });
    setMensaje("");
    setAsunto("");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Selección de Clientes</h3>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Seleccionar Todos
            </Button>
          </div>

          <div className="divide-y">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center space-x-4 py-2"
              >
                <Checkbox
                  checked={cliente.selected}
                  onCheckedChange={() => handleSelectCliente(cliente.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{cliente.nombre}</p>
                  <p className="text-sm text-gray-500">{cliente.empresa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recordatorio */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Enviar Recordatorio</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Envía recordatorios a los clientes seleccionados
              </p>
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
                Enviar a {getSelectedClientes().length} cliente(s)
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Promoción */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Enviar Promoción</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Envía promociones especiales
              </p>
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
                Enviar a {getSelectedClientes().length} cliente(s)
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Newsletter */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Newsletter</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Envía actualizaciones y noticias
              </p>
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
                Enviar a {getSelectedClientes().length} cliente(s)
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mensaje Personalizado */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Mensaje Personalizado</h3>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Envía un mensaje personalizado
              </p>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Mensaje Personalizado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Asunto</Label>
                <Input
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  placeholder="Asunto del mensaje"
                />
              </div>
              <div>
                <Label>Mensaje</Label>
                <Textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje personalizado..."
                />
              </div>
              <Button 
                className="w-full bg-teal hover:bg-sage"
                onClick={() => handleEnviarComunicacion("mensaje")}
              >
                Enviar a {getSelectedClientes().length} cliente(s)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
