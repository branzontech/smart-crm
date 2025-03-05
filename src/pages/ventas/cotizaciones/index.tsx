
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Wand2, Filter, SortAsc, SortDesc, Check, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
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

const CotizacionesIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
  const [selectedCotizaciones, setSelectedCotizaciones] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof cotizaciones[0] | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });
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

  const cotizaciones = [
    {
      id: 1,
      cliente: "Tech Solutions SA",
      numero: "COT-2024-001",
      monto: 25000,
      estado: "Enviada",
      fechaEmision: "2024-03-15",
      validezHasta: "2024-04-15",
    },
    {
      id: 2,
      cliente: "Green Energy Corp",
      numero: "COT-2024-002",
      monto: 45000,
      estado: "Aprobada",
      fechaEmision: "2024-03-10",
      validezHasta: "2024-04-10",
    },
    {
      id: 3,
      cliente: "Global Logistics",
      numero: "COT-2024-003",
      monto: 15000,
      estado: "En revisión",
      fechaEmision: "2024-03-12",
      validezHasta: "2024-04-12",
    },
  ];

  // Sort cotizaciones if sortConfig has a key
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

  // Filter cotizaciones based on searchTerm and filtroEstado
  const filteredCotizaciones = useMemo(() => {
    return sortedCotizaciones.filter(cotizacion => {
      const matchesSearch = searchTerm === "" || 
        cotizacion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotizacion.numero.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = filtroEstado === null || 
        cotizacion.estado === filtroEstado;
      
      return matchesSearch && matchesEstado;
    });
  }, [sortedCotizaciones, searchTerm, filtroEstado]);

  // Toggle sort for a column
  const requestSort = (key: keyof typeof cotizaciones[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle selection of a cotizacion
  const toggleSelection = (id: number) => {
    setSelectedCotizaciones(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Toggle all cotizaciones
  const toggleAllSelection = () => {
    if (selectedCotizaciones.length === filteredCotizaciones.length) {
      setSelectedCotizaciones([]);
    } else {
      setSelectedCotizaciones(filteredCotizaciones.map(c => c.id));
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  // Check if at least one cotizacion is selected
  const hasSelection = selectedCotizaciones.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 overflow-x-auto w-full max-w-full">
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

          {/* Filters Section */}
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
                <Select value={filtroEstado || ""} onValueChange={(value) => setFiltroEstado(value || null)}>
                  <SelectTrigger id="estado" className="w-full">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Enviada">Enviada</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="En revisión">En revisión</SelectItem>
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

          {/* Table View */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-in fade-in-50 duration-500">
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
                      <TableHead className="cursor-pointer text-right" onClick={() => requestSort('monto')}>
                        <div className="flex items-center justify-end">
                          Monto
                          {sortConfig.key === 'monto' && (
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
                      <TableHead className="cursor-pointer" onClick={() => requestSort('validezHasta')}>
                        <div className="flex items-center">
                          Válido hasta
                          {sortConfig.key === 'validezHasta' && (
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
                  {filteredCotizaciones.map((cotizacion) => (
                    <TableRow 
                      key={cotizacion.id} 
                      className={selectedCotizaciones.includes(cotizacion.id) ? "bg-mint/10" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedCotizaciones.includes(cotizacion.id)}
                            onChange={() => toggleSelection(cotizacion.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </TableCell>
                      
                      {visibleColumns.cliente && (
                        <TableCell className="font-medium">{cotizacion.cliente}</TableCell>
                      )}
                      
                      {visibleColumns.numero && (
                        <TableCell>{cotizacion.numero}</TableCell>
                      )}
                      
                      {visibleColumns.monto && (
                        <TableCell className="text-right">${cotizacion.monto.toLocaleString()}</TableCell>
                      )}
                      
                      {visibleColumns.estado && (
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            cotizacion.estado === "Aprobada"
                              ? "bg-green-100 text-green-800"
                              : cotizacion.estado === "Enviada"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {cotizacion.estado}
                          </span>
                        </TableCell>
                      )}
                      
                      {visibleColumns.fechaEmision && (
                        <TableCell>{new Date(cotizacion.fechaEmision).toLocaleDateString()}</TableCell>
                      )}
                      
                      {visibleColumns.validezHasta && (
                        <TableCell>{new Date(cotizacion.validezHasta).toLocaleDateString()}</TableCell>
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
                            <DropdownMenuItem onClick={() => navigate(`/ventas/cotizaciones/${cotizacion.id}`)}>
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/ventas/cotizaciones/${cotizacion.id}/editar`)}>
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
                  ))}
                  
                  {filteredCotizaciones.length === 0 && (
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
          </div>

          {/* Batch Actions */}
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
  );
};

export default CotizacionesIndex;
