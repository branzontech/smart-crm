
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
  Search,
  Bell,
  Tag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"nombre" | "empresa">("nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const handleSelectCliente = (id: number) => {
    setClientes(clientes.map(cliente => 
      cliente.id === id ? { ...cliente, selected: !cliente.selected } : cliente
    ));
  };

  const handleSelectVisible = () => {
    const visibleClients = filteredClientes.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const allVisibleSelected = visibleClients.every(cliente => cliente.selected);
    
    setClientes(clientes.map(cliente => ({
      ...cliente,
      selected: visibleClients.find(c => c.id === cliente.id)
        ? !allVisibleSelected
        : cliente.selected,
    })));
  };

  const handleSort = (field: "nombre" | "empresa") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredClientes = clientes
    .filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const compareValue = sortOrder === "asc" ? 1 : -1;
      return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
    });

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const currentClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-lg font-semibold">Selección de Clientes</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
              <Button
                variant="outline"
                onClick={handleSelectVisible}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Seleccionar Visibles
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="w-8 p-2">
                    <Checkbox
                      checked={currentClientes.length > 0 && currentClientes.every(c => c.selected)}
                      onCheckedChange={handleSelectVisible}
                    />
                  </th>
                  <th
                    className="p-2 text-left cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("nombre")}
                  >
                    Nombre
                  </th>
                  <th
                    className="p-2 text-left cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("empresa")}
                  >
                    Empresa
                  </th>
                  <th className="p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {currentClientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b">
                    <td className="p-2">
                      <Checkbox
                        checked={cliente.selected}
                        onCheckedChange={() => handleSelectCliente(cliente.id)}
                      />
                    </td>
                    <td className="p-2">{cliente.nombre}</td>
                    <td className="p-2">{cliente.empresa}</td>
                    <td className="p-2">{cliente.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              {getSelectedClientes().length} cliente(s) seleccionado(s)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
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
