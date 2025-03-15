
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  UserPlus, 
  Filter,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { getClientes, deleteCliente, Cliente } from "@/services/clientesService";
import { CreateClienteDialog } from "@/components/CreateClienteDialog";

export default function ClientesPage() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteIdToDelete, setClienteIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredClientes(clientes);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = clientes.filter((cliente) => {
      return (
        cliente.nombre.toLowerCase().includes(lowerSearch) ||
        (cliente.documento && cliente.documento.toLowerCase().includes(lowerSearch)) ||
        (cliente.email && cliente.email.toLowerCase().includes(lowerSearch))
      );
    });

    setFilteredClientes(filtered);
  }, [searchTerm, clientes]);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getClientes();
      if (error) throw error;
      
      if (data) {
        setClientes(data);
        setFilteredClientes(data);
      }
    } catch (error: any) {
      toast.error("Error al cargar clientes");
      console.error("Error fetching clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCliente = async () => {
    if (!clienteIdToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await deleteCliente(clienteIdToDelete);
      if (error) throw error;
      
      setClientes(prevClientes => prevClientes.filter(c => c.id !== clienteIdToDelete));
      toast.success("Cliente eliminado exitosamente");
    } catch (error: any) {
      toast.error(`Error al eliminar cliente: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setClienteIdToDelete(null);
    }
  };

  const handleClienteCreated = (nuevoCliente: { id: number; nombre: string }) => {
    toast.success(`Cliente "${nuevoCliente.nombre}" creado exitosamente`);
    fetchClientes();
  };

  const getTipoPersonaLabel = (tipo: string) => {
    return tipo === 'natural' ? 'Persona Natural' : 'Persona Jurídica';
  };

  const getTipoClienteColor = (tipo: string) => {
    switch (tipo) {
      case 'potencial':
        return 'bg-blue-100 text-blue-800';
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'recurrente':
        return 'bg-purple-100 text-purple-800';
      case 'referido':
        return 'bg-amber-100 text-amber-800';
      case 'suspendido':
        return 'bg-red-100 text-red-800';
      case 'corporativo':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="content-container pt-[var(--header-height)] overflow-y-auto">
          <div className="max-w-content">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <div className="flex space-x-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar clientes..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden md:flex"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <CreateClienteDialog onClienteCreated={handleClienteCreated} />
                <Button 
                  onClick={() => navigate("/clientes/nuevo")}
                  className="bg-teal hover:bg-teal/90"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-xl">Listado de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-teal" />
                    <span className="ml-2">Cargando clientes...</span>
                  </div>
                ) : filteredClientes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No se encontraron clientes</p>
                    <Button 
                      onClick={() => navigate("/clientes/nuevo")}
                      className="bg-teal hover:bg-teal/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Nuevo Cliente
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClientes.map((cliente) => (
                          <TableRow key={cliente.id}>
                            <TableCell className="font-medium">
                              {cliente.tipoPersona === 'natural'
                                ? `${cliente.nombre} ${cliente.apellidos || ''}`
                                : cliente.nombre}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{cliente.documento}</span>
                                <span className="text-xs text-gray-500">
                                  {getTipoPersonaLabel(cliente.tipoPersona)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {cliente.tipoPersona === 'juridica' 
                                ? 'Empresa' 
                                : cliente.empresa 
                                  ? cliente.empresa 
                                  : 'Individual'}
                            </TableCell>
                            <TableCell>{cliente.email}</TableCell>
                            <TableCell>{cliente.telefono}</TableCell>
                            <TableCell>
                              <Badge className={getTipoClienteColor(cliente.tipo)}>
                                {cliente.tipo.charAt(0).toUpperCase() + cliente.tipo.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/clientes/${cliente.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/clientes/${cliente.id}/editar`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setClienteIdToDelete(cliente.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Confirmación de eliminación */}
      <Dialog 
        open={!!clienteIdToDelete} 
        onOpenChange={(open) => !open && setClienteIdToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cliente</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCliente}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
