import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Wand2, Filter, SortAsc, SortDesc, MoreHorizontal, Loader2, Eye, CheckCircle, XCircle, Clock, Send } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllCotizaciones } from "@/services/cotizacionService";
import { Cotizacion } from "@/types/cotizacion";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const CotizacionesIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [selectedCotizaciones, setSelectedCotizaciones] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Cotizacion | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<{
    cliente: boolean;
    numero: boolean;
    monto: boolean;
    estado: boolean;
    fechaEmision: boolean;
    validezHasta: boolean;
  }>({
    cliente: true,
    numero: true,
    monto: true,
    estado: true,
    fechaEmision: true,
    validezHasta: true,
  });

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCotizaciones();
        console.log("Cotizaciones obtenidas:", data);
        setCotizaciones(data);
      } catch (error) {
        console.error("Error fetching cotizaciones:", error);
        toast.error("Error al cargar las cotizaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  const sortedCotizaciones = useMemo(() => {
    if (!sortConfig.key) return cotizaciones;
    
    return [...cotizaciones].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [cotizaciones, sortConfig]);

  const filteredCotizaciones = useMemo(() => {
    return sortedCotizaciones.filter(cotizacion => {
      const clienteNombre = cotizacion.cliente?.nombre || '';
      
      const matchesSearch = searchTerm === "" || 
        clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.numero.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filtroEstado === null || filtroEstado === "" || 
        cotizacion.estado === filtroEstado;
      
      return matchesSearch && matchesEstado;
    });
  }, [sortedCotizaciones, searchTerm, filtroEstado]);

  const requestSort = (key: keyof Cotizacion) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelection = (id: string) => {
    setSelectedCotizaciones(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedCotizaciones.length === filteredCotizaciones.length && filteredCotizaciones.length > 0) {
      setSelectedCotizaciones([]);
    } else {
      setSelectedCotizaciones(filteredCotizaciones.map(c => c.id || '').filter(id => id !== ''));
    }
  };

  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return "bg-green-100 text-green-800";
      case 'enviada':
        return "bg-blue-100 text-blue-800";
      case 'borrador':
        return "bg-gray-100 text-gray-800";
      case 'rechazada':
        return "bg-red-100 text-red-800";
      case 'vencida':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'enviada':
        return <Send className="h-4 w-4 text-blue-600" />;
      case 'borrador':
        return <FileText className="h-4 w-4 text-gray-600" />;
      case 'rechazada':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'vencida':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEstadoDisplayName = (estado: string) => {
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  const hasSelection = selectedCotizaciones.length > 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex flex-col overflow-hidden main-container">
        <Header />
        <main className="flex-1 overflow-auto p-6 pt-[calc(var(--header-height)+1.5rem)]">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-teal" />
                <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  onClick={() => navigate("/ventas/cotizaciones/nueva")}
                  variant="outline"
                  className="text-teal hover:text-sage border-teal hover:border-sage transition-colors duration-200"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Formulario Básico
                </Button>
                <Button
                  onClick={() => navigate("/ventas/cotizaciones/nueva-wizard")}
                  className="bg-teal hover:bg-sage text-white transition-colors duration-200"
                  size="sm"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Asistente Avanzado
                </Button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <Label htmlFor="search" className="mb-2 block">Buscar</Label>
                  <Input
                    id="search"
                    placeholder="Buscar por cliente o número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <Label htmlFor="estado" className="mb-2 block">Estado</Label>
                  <Select 
                    value={filtroEstado || ""} 
                    onValueChange={(value) => setFiltroEstado(value === "" ? null : value)}
                  >
                    <SelectTrigger id="estado" className="w-full">
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="borrador">Borrador</SelectItem>
                      <SelectItem value="enviada">Enviada</SelectItem>
                      <SelectItem value="aprobada">Aprobada</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                      <SelectItem value="vencida">Vencida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-auto flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Columnas
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.cliente}
                        onCheckedChange={() => toggleColumnVisibility('cliente')}
                      >
                        Cliente
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.numero}
                        onCheckedChange={() => toggleColumnVisibility('numero')}
                      >
                        Número
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.monto}
                        onCheckedChange={() => toggleColumnVisibility('monto')}
                      >
                        Monto
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.estado}
                        onCheckedChange={() => toggleColumnVisibility('estado')}
                      >
                        Estado
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.fechaEmision}
                        onCheckedChange={() => toggleColumnVisibility('fechaEmision')}
                      >
                        Fecha Emisión
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={visibleColumns.validezHasta}
                        onCheckedChange={() => toggleColumnVisibility('validezHasta')}
                      >
                        Válido Hasta
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-in fade-in-50 duration-500">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedCotizaciones.length === filteredCotizaciones.length && filteredCotizaciones.length > 0}
                              onChange={toggleAllSelection}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                        </TableHead>
                        
                        {visibleColumns.cliente && (
                          <TableHead className="cursor-pointer" onClick={() => requestSort('cliente')}>
                            <div className="flex items-center">
                              Cliente
                              {sortConfig.key === 'cliente' && (
                                sortConfig.direction === 'asc' 
                                  ? <SortAsc className="ml-1 h-4 w-4" /> 
                                  : <SortDesc className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.numero && (
                          <TableHead className="cursor-pointer" onClick={() => requestSort('numero')}>
                            <div className="flex items-center">
                              Número
                              {sortConfig.key === 'numero' && (
                                sortConfig.direction === 'asc' 
                                  ? <SortAsc className="ml-1 h-4 w-4" /> 
                                  : <SortDesc className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.monto && (
                          <TableHead className="cursor-pointer text-right" onClick={() => requestSort('total')}>
                            <div className="flex items-center justify-end">
                              Monto
                              {sortConfig.key === 'total' && (
                                sortConfig.direction === 'asc' 
                                  ? <SortAsc className="ml-1 h-4 w-4" /> 
                                  : <SortDesc className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.estado && (
                          <TableHead className="cursor-pointer" onClick={() => requestSort('estado')}>
                            <div className="flex items-center">
                              Estado
                              {sortConfig.key === 'estado' && (
                                sortConfig.direction === 'asc' 
                                  ? <SortAsc className="ml-1 h-4 w-4" /> 
                                  : <SortDesc className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.fechaEmision && (
                          <TableHead className="cursor-pointer" onClick={() => requestSort('fechaEmision')}>
                            <div className="flex items-center">
                              Emisión
                              {sortConfig.key === 'fechaEmision' && (
                                sortConfig.direction === 'asc' 
                                  ? <SortAsc className="ml-1 h-4 w-4" /> 
                                  : <SortDesc className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        )}
                        
                        {visibleColumns.validezHasta && (
                          <TableHead className="cursor-pointer" onClick={() => requestSort('fechaVencimiento')}>
                            <div className="flex items-center">
                              Válido hasta
                              {sortConfig.key === 'fechaVencimiento' && (
                                sortConfig.direction === 'asc' 
                                  ? <SortAsc className="ml-1 h-4 w-4" /> 
                                  : <SortDesc className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                        )}
                        
                        <TableHead className="w-[80px]">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCotizaciones.length > 0 ? (
                        filteredCotizaciones.map((cotizacion) => (
                          <TableRow 
                            key={cotizacion.id} 
                            className={selectedCotizaciones.includes(cotizacion.id || '') ? "bg-mint/10" : ""}
                          >
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCotizaciones.includes(cotizacion.id || '')}
                                  onChange={() => cotizacion.id && toggleSelection(cotizacion.id)}
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                              </div>
                            </TableCell>
                            
                            {visibleColumns.cliente && (
                              <TableCell className="font-medium">{cotizacion.cliente.nombre}</TableCell>
                            )}
                            
                            {visibleColumns.numero && (
                              <TableCell>{cotizacion.numero}</TableCell>
                            )}
                            
                            {visibleColumns.monto && (
                              <TableCell className="text-right">{formatCurrency(cotizacion.total)}</TableCell>
                            )}
                            
                            {visibleColumns.estado && (
                              <TableCell>
                                <div className="flex items-center gap-1.5">
                                  {getEstadoIcon(cotizacion.estado)}
                                  <span className={`px-2 py-1 rounded-full text-xs ${getEstadoClass(cotizacion.estado)}`}>
                                    {getEstadoDisplayName(cotizacion.estado)}
                                  </span>
                                </div>
                              </TableCell>
                            )}
                            
                            {visibleColumns.fechaEmision && (
                              <TableCell>{formatDate(cotizacion.fechaEmision)}</TableCell>
                            )}
                            
                            {visibleColumns.validezHasta && (
                              <TableCell>{formatDate(cotizacion.fechaVencimiento)}</TableCell>
                            )}
                            
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => cotizacion.id && navigate(`/ventas/cotizaciones/${cotizacion.id}`)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => cotizacion.id && navigate(`/ventas/cotizaciones/${cotizacion.id}/editar`)}>
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={
                            1 + // Checkbox column
                            Object.values(visibleColumns).filter(Boolean).length + // Visible data columns
                            1 // Action column
                          } className="h-24 text-center">
                            No se encontraron cotizaciones con los filtros seleccionados
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {hasSelection && (
              <div className="mt-4 flex justify-end gap-2 animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
                <Button variant="outline" size="sm" onClick={() => setSelectedCotizaciones([])}>
                  Cancelar selección
                </Button>
                <Button variant="default" size="sm" className="bg-teal hover:bg-sage">
                  Acciones ({selectedCotizaciones.length})
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CotizacionesIndex;
