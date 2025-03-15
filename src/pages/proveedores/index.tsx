
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Edit, Eye, Trash2, Search, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProveedores, deleteProveedor, Proveedor } from "@/services/proveedoresService";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const ProveedoresIndex = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [proveedorIdToDelete, setProveedorIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProveedores();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProveedores(proveedores);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const filtered = proveedores.filter((proveedor) => {
      return (
        proveedor.nombre.toLowerCase().includes(lowerSearch) ||
        proveedor.documento.toLowerCase().includes(lowerSearch) ||
        proveedor.contacto.toLowerCase().includes(lowerSearch)
      );
    });

    setFilteredProveedores(filtered);
  }, [searchTerm, proveedores]);

  const fetchProveedores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getProveedores();
      if (error) throw error;
      
      if (data) {
        setProveedores(data);
        setFilteredProveedores(data);
      }
    } catch (error: any) {
      toast.error("Error al cargar proveedores");
      console.error("Error fetching proveedores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProveedor = async () => {
    if (!proveedorIdToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await deleteProveedor(proveedorIdToDelete);
      if (error) throw error;
      
      setProveedores(prevProveedores => prevProveedores.filter(p => p.id !== proveedorIdToDelete));
      toast.success("Proveedor eliminado exitosamente");
    } catch (error: any) {
      toast.error(`Error al eliminar proveedor: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setProveedorIdToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 content-container pt-[var(--header-height)]">
          <div className="max-w-content">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-teal" />
                <h1 className="text-2xl font-semibold text-gray-900">Proveedores</h1>
              </div>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar proveedores..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => navigate("/proveedores/nuevo")}
                  className="bg-teal hover:bg-sage text-white transition-colors duration-200"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Proveedor
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Listado de Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-teal" />
                    <span className="ml-2">Cargando proveedores...</span>
                  </div>
                ) : filteredProveedores.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No se encontraron proveedores</p>
                    <Button 
                      onClick={() => navigate("/proveedores/nuevo")}
                      className="bg-teal hover:bg-teal/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Nuevo Proveedor
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-mint/20">
                        <TableRow>
                          <TableHead className="text-teal">Nombre</TableHead>
                          <TableHead className="text-teal">Tipo Doc.</TableHead>
                          <TableHead className="text-teal">Documento</TableHead>
                          <TableHead className="text-teal">Contacto</TableHead>
                          <TableHead className="text-teal">Sector</TableHead>
                          <TableHead className="text-teal">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProveedores.map((proveedor) => (
                          <TableRow
                            key={proveedor.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                            <TableCell>{proveedor.tipo_documento}</TableCell>
                            <TableCell>{proveedor.documento}</TableCell>
                            <TableCell>{proveedor.contacto}</TableCell>
                            <TableCell>
                              {proveedor.sectores?.nombre || proveedor.tipo_proveedor}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/proveedores/${proveedor.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => navigate(`/proveedores/${proveedor.id}/editar`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setProveedorIdToDelete(proveedor.id)}
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

      <Dialog 
        open={!!proveedorIdToDelete} 
        onOpenChange={(open) => !open && setProveedorIdToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Proveedor</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProveedor}
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

export default ProveedoresIndex;
