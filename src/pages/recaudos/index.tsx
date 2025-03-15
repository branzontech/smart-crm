
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Coins, Plus, Calendar, AlertCircle, Check, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getRecaudos } from "@/services/recaudos/recaudosService";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const RecaudosIndex = () => {
  const navigate = useNavigate();
  const [recaudos, setRecaudos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRecaudos = async () => {
      setLoading(true);
      const { data, error } = await getRecaudos();
      
      if (error) {
        toast.error("Error al cargar los recaudos");
        console.error("Error fetching recaudos:", error);
      } else if (data) {
        setRecaudos(data);
      }
      
      setLoading(false);
    };

    fetchRecaudos();
  }, []);

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pagado':
        return <Check className="h-4 w-4 mr-1" />;
      case 'pendiente':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'en proceso':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'vencido':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pagado':
        return "bg-green-100 text-green-800";
      case 'pendiente':
        return "bg-yellow-100 text-yellow-800";
      case 'en proceso':
        return "bg-blue-100 text-blue-800";
      case 'vencido':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(recaudos.length / itemsPerPage);
  const paginatedRecaudos = recaudos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-teal" />
              <h1 className="text-2xl font-semibold text-gray-900">Recaudos</h1>
            </div>
            <Button
              onClick={() => navigate("/recaudos/nuevo")}
              className="bg-teal hover:bg-sage text-white transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Recaudo
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-teal border-r-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando recaudos...</p>
            </div>
          ) : recaudos.length === 0 ? (
            <Card className="p-10 text-center bg-white">
              <p className="text-gray-500 mb-4">No hay recaudos registrados</p>
              <Button
                onClick={() => navigate("/recaudos/nuevo")}
                className="bg-teal hover:bg-sage text-white transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Recaudo
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedRecaudos.map((recaudo) => (
                  <Card key={recaudo.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/recaudos/${recaudo.id}`)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{recaudo.numero}</h3>
                          <Badge variant="outline" className="text-xs">{recaudo.cliente?.nombre} {recaudo.cliente?.apellidos}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            <span>Vencimiento: {format(new Date(recaudo.fecha_vencimiento), 'dd MMM yyyy', { locale: es })}</span>
                          </div>
                          <div>
                            <span>Método: {recaudo.metodo_pago}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ${Number(recaudo.monto).toLocaleString()}
                        </p>
                        <div className="mt-1">
                          <Badge className={`px-2 py-1 flex items-center w-fit ml-auto ${getStatusClass(recaudo.estado)}`}>
                            {getStatusIcon(recaudo.estado)}
                            {recaudo.estado}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          isActive={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecaudosIndex;
