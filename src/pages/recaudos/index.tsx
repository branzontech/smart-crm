import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Coins, Plus, Calendar, AlertCircle, Check, Clock, LayoutGrid, LayoutList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getRecaudos } from "@/services/recaudos/recaudosService";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RecaudoFilterBar } from "@/components/recaudos/RecaudoFilterBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { RecaudoDetailDialog } from "@/components/recaudos/RecaudoDetailDialog";
import { RecaudoStatusDialog } from "@/components/recaudos/RecaudoStatusDialog";
import { RecaudoPaymentDialog } from "@/components/recaudos/RecaudoPaymentDialog";
import { Recaudo } from "./seguimiento";
import { updateRecaudoStatus, updateRecaudoNotes } from "@/services/recaudos/detailsService";

const RecaudosIndex = () => {
  const navigate = useNavigate();
  const [recaudos, setRecaudos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const itemsPerPage = 5;
  const isMobile = useIsMobile();
  
  const [selectedRecaudo, setSelectedRecaudo] = useState<Recaudo | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");

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

  const handleViewRecaudo = (recaudo: any) => {
    const convertedRecaudo: Recaudo = {
      id: recaudo.id,
      cliente: recaudo.cliente?.nombre + ' ' + (recaudo.cliente?.apellidos || ''),
      factura: recaudo.numero,
      monto: recaudo.monto,
      fechaVencimiento: recaudo.fecha_vencimiento,
      estado: recaudo.estado,
      diasVencido: recaudo.fecha_vencimiento ? 
        Math.max(0, Math.floor((new Date().getTime() - new Date(recaudo.fecha_vencimiento).getTime()) / (1000 * 3600 * 24))) : 0
    };
    
    setSelectedRecaudo(convertedRecaudo);
    setShowDetailDialog(true);
  };

  const handleChangeStatus = (recaudo: any) => {
    const convertedRecaudo: Recaudo = {
      id: recaudo.id,
      cliente: recaudo.cliente?.nombre + ' ' + (recaudo.cliente?.apellidos || ''),
      factura: recaudo.numero,
      monto: recaudo.monto,
      fechaVencimiento: recaudo.fecha_vencimiento,
      estado: recaudo.estado,
      diasVencido: recaudo.fecha_vencimiento ? 
        Math.max(0, Math.floor((new Date().getTime() - new Date(recaudo.fecha_vencimiento).getTime()) / (1000 * 3600 * 24))) : 0
    };
    
    setSelectedRecaudo(convertedRecaudo);
    setNewStatus(recaudo.estado);
    setShowStatusDialog(true);
  };

  const handlePayment = (recaudo: any) => {
    const convertedRecaudo: Recaudo = {
      id: recaudo.id,
      cliente: recaudo.cliente?.nombre + ' ' + (recaudo.cliente?.apellidos || ''),
      factura: recaudo.numero,
      monto: recaudo.monto,
      fechaVencimiento: recaudo.fecha_vencimiento,
      estado: recaudo.estado,
      diasVencido: recaudo.fecha_vencimiento ? 
        Math.max(0, Math.floor((new Date().getTime() - new Date(recaudo.fecha_vencimiento).getTime()) / (1000 * 3600 * 24))) : 0
    };
    
    setSelectedRecaudo(convertedRecaudo);
    setShowPaymentDialog(true);
  };

  const updateStatus = async (id: string, status: string) => {
    const result = await updateRecaudoStatus(id, status);
    
    if (result.success) {
      setRecaudos(recaudos.map(recaudo => 
        recaudo.id === id ? { ...recaudo, estado: status } : recaudo
      ));
      setShowStatusDialog(false);
    }
  };

  const markAsPaid = async (id: string) => {
    const result = await updateRecaudoStatus(id, "Pagado");
    
    if (result.success) {
      setRecaudos(recaudos.map(recaudo => 
        recaudo.id === id ? { ...recaudo, estado: "Pagado" } : recaudo
      ));
      setShowPaymentDialog(false);
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    await updateRecaudoNotes(id, notes);
  };

  const totalPages = Math.ceil(recaudos.length / itemsPerPage);
  const paginatedRecaudos = recaudos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 w-full mt-14 md:ml-[var(--sidebar-width,5rem)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-teal" />
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Recaudos</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleViewMode}
                className="hidden md:flex"
                title={viewMode === 'cards' ? 'Ver como tabla' : 'Ver como tarjetas'}
              >
                {viewMode === 'cards' ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => navigate("/recaudos/nuevo")}
                className="bg-teal hover:bg-sage text-white transition-colors duration-200"
                size={isMobile ? "sm" : "default"}
              >
                <Plus className="mr-2 h-4 w-4" />
                {!isMobile && "Nuevo Recaudo"}
                {isMobile && "Nuevo"}
              </Button>
            </div>
          </div>

          <RecaudoFilterBar />

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-teal border-r-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando recaudos...</p>
            </div>
          ) : recaudos.length === 0 ? (
            <Card className="p-6 md:p-10 text-center bg-white">
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
              {viewMode === 'cards' ? (
                <div className="grid gap-4">
                  {paginatedRecaudos.map((recaudo) => (
                    <Card 
                      key={recaudo.id} 
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer" 
                      onClick={() => handleViewRecaudo(recaudo)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-lg">{recaudo.numero}</h3>
                            <Badge variant="outline" className="text-xs">{recaudo.cliente?.nombre} {recaudo.cliente?.apellidos}</Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              <span>Vencimiento: {format(new Date(recaudo.fecha_vencimiento), 'dd MMM yyyy', { locale: es })}</span>
                            </div>
                            <div>
                              <span>Método: {recaudo.metodo_pago}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="font-semibold text-lg">
                            ${Number(recaudo.monto).toLocaleString()}
                          </p>
                          <div className="mt-1">
                            <Badge className={`px-2 py-1 flex items-center w-fit sm:ml-auto ${getStatusClass(recaudo.estado)}`}>
                              {getStatusIcon(recaudo.estado)}
                              {recaudo.estado}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRecaudos.map((recaudo) => (
                        <TableRow 
                          key={recaudo.id} 
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell className="font-medium" onClick={() => handleViewRecaudo(recaudo)}>
                            {recaudo.numero}
                          </TableCell>
                          <TableCell onClick={() => handleViewRecaudo(recaudo)}>
                            {recaudo.cliente?.nombre} {recaudo.cliente?.apellidos}
                          </TableCell>
                          <TableCell onClick={() => handleViewRecaudo(recaudo)}>
                            {format(new Date(recaudo.fecha_vencimiento), 'dd MMM yyyy', { locale: es })}
                          </TableCell>
                          <TableCell onClick={() => handleViewRecaudo(recaudo)}>
                            {recaudo.metodo_pago}
                          </TableCell>
                          <TableCell onClick={() => handleViewRecaudo(recaudo)}>
                            ${Number(recaudo.monto).toLocaleString()}
                          </TableCell>
                          <TableCell onClick={() => handleViewRecaudo(recaudo)}>
                            <Badge className={`flex items-center w-fit ${getStatusClass(recaudo.estado)}`}>
                              {getStatusIcon(recaudo.estado)}
                              {recaudo.estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeStatus(recaudo);
                                }}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                              {recaudo.estado !== "Pagado" && (
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePayment(recaudo);
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

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

        <RecaudoDetailDialog 
          open={showDetailDialog} 
          onOpenChange={setShowDetailDialog} 
          recaudo={selectedRecaudo}
          onEditStatus={handleChangeStatus}
          onUpdateNotes={updateNotes}
        />

        <RecaudoStatusDialog 
          open={showStatusDialog} 
          onOpenChange={setShowStatusDialog} 
          recaudo={selectedRecaudo} 
          nuevoEstado={newStatus}
          onEstadoChange={setNewStatus}
          onConfirm={() => selectedRecaudo && updateStatus(selectedRecaudo.id, newStatus)}
        />

        <RecaudoPaymentDialog 
          open={showPaymentDialog} 
          onOpenChange={setShowPaymentDialog} 
          recaudo={selectedRecaudo} 
          onConfirm={(id) => markAsPaid(id)}
        />
      </main>
    </div>
  );
};

export default RecaudosIndex;
