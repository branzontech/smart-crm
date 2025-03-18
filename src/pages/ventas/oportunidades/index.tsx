
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getOportunidades, deleteOportunidad, Oportunidad } from "@/services/oportunidadesService";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { OportunidadDrawer } from "@/components/oportunidades/OportunidadDrawer";
import { Layout } from "@/components/layout/Layout";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const OportunidadesIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOportunidadId, setSelectedOportunidadId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOportunidades = async () => {
    setIsLoading(true);
    try {
      const data = await getOportunidades();
      setOportunidades(data);
    } catch (error) {
      console.error("Error fetching oportunidades:", error);
      toast.error("No se pudieron cargar las oportunidades");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOportunidades();
  }, []);

  const handleDeleteOportunidad = async (id: string) => {
    try {
      const success = await deleteOportunidad(id);
      if (success) {
        toast.success("Oportunidad eliminada exitosamente");
        fetchOportunidades(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting oportunidad:", error);
      toast.error("No se pudo eliminar la oportunidad");
    }
  };

  const handleOpenDrawer = (id: string) => {
    setSelectedOportunidadId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const filteredOportunidades = oportunidades.filter(
    (oportunidad) =>
      oportunidad.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredOportunidades.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOportunidades.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationLinks = () => {
    const links = [];
    for (let i = 1; i <= totalPages; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)} 
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return links;
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-teal-500" />
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Oportunidades</h1>
          </div>
          
          {/* Updated button with gradient background */}
          <Button
            onClick={() => navigate("/ventas/oportunidades/nueva")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-colors duration-200 w-full sm:w-auto border-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Oportunidad
          </Button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando oportunidades...</p>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((oportunidad) => (
              <Card key={oportunidad.id} className="p-4 transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{oportunidad.cliente}</h3>
                    <p className="text-sm text-gray-500">
                      Cierre estimado: {new Date(oportunidad.fecha_cierre).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-semibold text-lg">
                      ${oportunidad.valor.toLocaleString()}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        oportunidad.probabilidad >= 70
                          ? "bg-green-100 text-green-800"
                          : oportunidad.probabilidad >= 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {oportunidad.probabilidad}% prob.
                      </span>
                      <span className="text-sm text-gray-600">{oportunidad.etapa}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-teal-500 hover:text-teal-700 hover:bg-teal-50"
                    onClick={() => handleOpenDrawer(oportunidad.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => navigate(`/ventas/oportunidades/${oportunidad.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-100">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar oportunidad?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Eliminará permanentemente esta oportunidad
                          de ventas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteOportunidad(oportunidad.id)}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron oportunidades con ese criterio</p>
              {/* Also update this button with the same gradient */}
              <Button 
                onClick={() => navigate("/ventas/oportunidades/nueva")} 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mt-4 border-0"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Nueva Oportunidad
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredOportunidades.length > 0 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                  </PaginationItem>
                )}
                
                {renderPaginationLinks()}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Drawer for editing opportunity */}
      <OportunidadDrawer 
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        oportunidadId={selectedOportunidadId}
        onUpdate={fetchOportunidades}
      />
    </Layout>
  );
};

export default OportunidadesIndex;
