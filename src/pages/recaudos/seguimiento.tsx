
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Check, 
  Coins, 
  Search, 
  Clock, 
  AlertCircle, 
  Eye, 
  Printer,
  MoreHorizontal,
  Columns,
  GripVertical,
  Calendar,
  DollarSign,
  Building,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useReactToPrint } from "react-to-print";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";

// Tipos para las columnas
interface Column {
  id: string;
  header: string;
  accessorKey: string;
  isVisible: boolean;
  order: number;
}

// Tipo para el recaudo
interface Recaudo {
  id: string;
  cliente: string;
  factura: string;
  monto: number;
  fechaVencimiento: string;
  estado: string;
  diasVencido: number;
  detalles?: {
    direccion: string;
    telefono: string;
    articulos: Array<{
      nombre: string;
      cantidad: number;
      precio: number;
    }>;
    metodoPago: string;
    notas: string;
  };
}

const SeguimientoRecaudos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("todos");
  const [recaudoSeleccionado, setRecaudoSeleccionado] = useState<Recaudo | null>(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarPagoConfirmacion, setMostrarPagoConfirmacion] = useState(false);
  const [mostrarCambioEstado, setMostrarCambioEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [montoMinimo, setMontoMinimo] = useState("");
  const [montoMaximo, setMontoMaximo] = useState("");
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const impresionRef = useRef<HTMLDivElement>(null);

  // Datos ficticios de recaudos pendientes o en proceso
  const recaudosPendientes: Recaudo[] = [
    {
      id: "REC-2023-001",
      cliente: "Tech Solutions SA",
      factura: "FAC-2023-045",
      monto: 15000,
      fechaVencimiento: "2023-11-15",
      estado: "Pendiente",
      diasVencido: 0,
      detalles: {
        direccion: "Calle Principal #123, Ciudad Empresa",
        telefono: "+57 300 123 4567",
        articulos: [
          { nombre: "Servicio de Consultoría", cantidad: 1, precio: 15000 }
        ],
        metodoPago: "Transferencia",
        notas: "Pago a 30 días"
      }
    },
    {
      id: "REC-2023-002",
      cliente: "Green Energy Corp",
      factura: "FAC-2023-032",
      monto: 45000,
      fechaVencimiento: "2023-10-25",
      estado: "Vencido",
      diasVencido: 21,
      detalles: {
        direccion: "Av. Sostenible #456, Ciudad Verde",
        telefono: "+57 300 765 4321",
        articulos: [
          { nombre: "Paneles Solares", cantidad: 3, precio: 10000 },
          { nombre: "Instalación", cantidad: 1, precio: 15000 }
        ],
        metodoPago: "Efectivo",
        notas: "Cliente con historial de pagos tardíos"
      }
    },
    {
      id: "REC-2023-003",
      cliente: "Global Logistics",
      factura: "FAC-2023-018",
      monto: 28500,
      fechaVencimiento: "2023-11-05",
      estado: "En proceso",
      diasVencido: 0,
      detalles: {
        direccion: "Puerto Industrial #789, Ciudad Logística",
        telefono: "+57 300 987 6543",
        articulos: [
          { nombre: "Servicio de Transporte", cantidad: 1, precio: 28500 }
        ],
        metodoPago: "Transferencia",
        notas: "El cliente confirmó la transferencia, esperando verificación"
      }
    },
    {
      id: "REC-2023-004",
      cliente: "Digital Systems Inc",
      factura: "FAC-2023-067",
      monto: 12800,
      fechaVencimiento: "2023-11-30",
      estado: "Pendiente",
      diasVencido: 0,
      detalles: {
        direccion: "Calle Tecnológica #321, Ciudad Digital",
        telefono: "+57 300 234 5678",
        articulos: [
          { nombre: "Hosting Anual", cantidad: 1, precio: 8800 },
          { nombre: "Dominio Premium", cantidad: 1, precio: 4000 }
        ],
        metodoPago: "Tarjeta de Crédito",
        notas: "Renovación automática anual"
      }
    },
    {
      id: "REC-2023-005",
      cliente: "Smart Solutions",
      factura: "FAC-2023-039",
      monto: 35600,
      fechaVencimiento: "2023-10-15",
      estado: "Vencido",
      diasVencido: 31,
      detalles: {
        direccion: "Av. Innovación #654, Ciudad Inteligente",
        telefono: "+57 300 876 5432",
        articulos: [
          { nombre: "Software a medida", cantidad: 1, precio: 30000 },
          { nombre: "Soporte técnico", cantidad: 1, precio: 5600 }
        ],
        metodoPago: "Cheque",
        notas: "Contactar para gestionar el cobro"
      }
    }
  ];

  // Estado para almacenar los recaudos filtrados
  const [recaudos, setRecaudos] = useState<Recaudo[]>(recaudosPendientes);

  // Definición de columnas
  const [columnas, setColumnas] = useState<Column[]>([
    { id: "id", header: "ID", accessorKey: "id", isVisible: true, order: 0 },
    { id: "cliente", header: "Cliente", accessorKey: "cliente", isVisible: true, order: 1 },
    { id: "factura", header: "Factura", accessorKey: "factura", isVisible: true, order: 2 },
    { id: "monto", header: "Monto", accessorKey: "monto", isVisible: true, order: 3 },
    { id: "fechaVencimiento", header: "Vencimiento", accessorKey: "fechaVencimiento", isVisible: true, order: 4 },
    { id: "estado", header: "Estado", accessorKey: "estado", isVisible: true, order: 5 },
    { id: "acciones", header: "Acciones", accessorKey: "acciones", isVisible: true, order: 6 },
  ]);

  // Estado para el drag & drop
  const [columnaDrag, setColumnaDrag] = useState<string | null>(null);

  // Función para filtrar recaudos
  const filtrarRecaudos = () => {
    let recaudosFiltrados = recaudosPendientes;
    
    // Filtrar por texto (cliente, factura, id)
    if (filtro) {
      const lowercaseFiltro = filtro.toLowerCase();
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => 
          recaudo.cliente.toLowerCase().includes(lowercaseFiltro) ||
          recaudo.factura.toLowerCase().includes(lowercaseFiltro) ||
          recaudo.id.toLowerCase().includes(lowercaseFiltro)
      );
    }
    
    // Filtrar por estado
    if (estado !== "todos") {
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => recaudo.estado.toLowerCase() === estado.toLowerCase()
      );
    }
    
    // Filtrar por rango de fechas
    if (fechaDesde) {
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => new Date(recaudo.fechaVencimiento) >= fechaDesde
      );
    }
    
    if (fechaHasta) {
      recaudosFiltrados = recaudosFiltrados.filter(
        recaudo => new Date(recaudo.fechaVencimiento) <= fechaHasta
      );
    }
    
    // Filtrar por rango de montos
    if (montoMinimo !== "") {
      const min = parseFloat(montoMinimo);
      if (!isNaN(min)) {
        recaudosFiltrados = recaudosFiltrados.filter(
          recaudo => recaudo.monto >= min
        );
      }
    }
    
    if (montoMaximo !== "") {
      const max = parseFloat(montoMaximo);
      if (!isNaN(max)) {
        recaudosFiltrados = recaudosFiltrados.filter(
          recaudo => recaudo.monto <= max
        );
      }
    }
    
    setRecaudos(recaudosFiltrados);
  };

  // Efecto para aplicar filtros
  const handleFiltroBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
    setTimeout(filtrarRecaudos, 0);
  };

  const handleFiltroEstado = (value: string) => {
    setEstado(value);
    setTimeout(filtrarRecaudos, 0);
  };

  const handleLimpiarFiltros = () => {
    setFiltro("");
    setEstado("todos");
    setFechaDesde(undefined);
    setFechaHasta(undefined);
    setMontoMinimo("");
    setMontoMaximo("");
    setRecaudos(recaudosPendientes);
  };

  // Función para marcar como pagado
  const marcarComoPagado = (id: string) => {
    // Aquí se enviaría la actualización a la API
    toast.success(`Recaudo ${id} marcado como pagado`);
    
    // Actualizamos el estado local
    const recaudosActualizados = recaudos.filter(recaudo => recaudo.id !== id);
    setRecaudos(recaudosActualizados);
    setMostrarPagoConfirmacion(false);
  };

  // Función para cambiar estado
  const cambiarEstado = () => {
    if (recaudoSeleccionado && nuevoEstado) {
      // Aquí se enviaría la actualización a la API
      toast.success(`Estado de recaudo ${recaudoSeleccionado.id} cambiado a ${nuevoEstado}`);
      
      // Actualizamos el estado local
      const recaudosActualizados = recaudos.map(recaudo => 
        recaudo.id === recaudoSeleccionado.id 
          ? { ...recaudo, estado: nuevoEstado } 
          : recaudo
      );
      setRecaudos(recaudosActualizados);
      setMostrarCambioEstado(false);
    }
  };

  // Función para ver detalle de recaudo
  const verDetalleRecaudo = (recaudo: Recaudo) => {
    setRecaudoSeleccionado(recaudo);
    setMostrarDetalle(true);
  };

  // Función para abrir diálogo de confirmación de pago
  const confirmarPago = (recaudo: Recaudo) => {
    setRecaudoSeleccionado(recaudo);
    setMostrarPagoConfirmacion(true);
  };

  // Función para abrir diálogo de cambio de estado
  const abrirCambioEstado = (recaudo: Recaudo) => {
    setRecaudoSeleccionado(recaudo);
    setNuevoEstado(recaudo.estado);
    setMostrarCambioEstado(true);
  };

  // Función para cambiar visibilidad de columnas
  const toggleColumnaVisibilidad = (id: string) => {
    setColumnas(prevColumnas => 
      prevColumnas.map(col => 
        col.id === id ? { ...col, isVisible: !col.isVisible } : col
      )
    );
  };

  // Funciones para drag & drop de columnas
  const handleDragStart = (id: string) => {
    setColumnaDrag(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, id: string) => {
    e.preventDefault();
    if (columnaDrag && columnaDrag !== id) {
      const columnasList = [...columnas];
      const dragIndex = columnasList.findIndex(col => col.id === columnaDrag);
      const hoverIndex = columnasList.findIndex(col => col.id === id);
      
      if (dragIndex !== -1 && hoverIndex !== -1) {
        // Intercambiar órdenes
        const dragOrder = columnasList[dragIndex].order;
        columnasList[dragIndex].order = columnasList[hoverIndex].order;
        columnasList[hoverIndex].order = dragOrder;
        
        setColumnas(columnasList);
      }
    }
  };

  const handleDragEnd = () => {
    setColumnaDrag(null);
  };

  // Para imprimir el detalle
  const handlePrint = useReactToPrint({
    content: () => impresionRef.current,
  });

  // Aplicar filtros cuando cambian
  const aplicarFiltros = () => {
    filtrarRecaudos();
    setMostrarFiltrosAvanzados(false);
  };

  // Obtener columnas ordenadas y visibles
  const columnasOrdenadas = [...columnas]
    .sort((a, b) => a.order - b.order)
    .filter(col => col.isVisible);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="text-teal hover:text-sage hover:bg-mint/20"
                  onClick={() => navigate("/recaudos")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <Coins className="h-6 w-6 text-teal" />
                  Seguimiento de Recaudos
                </h1>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Filtrar Recaudos</CardTitle>
                <CardDescription>
                  Utilice los filtros para encontrar recaudos específicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por cliente, factura o ID"
                        className="pl-10"
                        value={filtro}
                        onChange={handleFiltroBusqueda}
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <Select
                        value={estado}
                        onValueChange={handleFiltroEstado}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos los estados</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="en proceso">En proceso</SelectItem>
                          <SelectItem value="vencido">Vencido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                      className="text-teal"
                    >
                      {mostrarFiltrosAvanzados ? "Ocultar filtros avanzados" : "Mostrar filtros avanzados"}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={handleLimpiarFiltros}
                      className="text-gray-500"
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                  
                  {mostrarFiltrosAvanzados && (
                    <div className="p-4 bg-gray-50 rounded-md space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-teal" />
                            Rango de fechas
                          </h3>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fechaDesde ? format(fechaDesde, 'PP', { locale: es }) : "Fecha desde"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={fechaDesde}
                                    onSelect={setFechaDesde}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div className="flex-1">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {fechaHasta ? format(fechaHasta, 'PP', { locale: es }) : "Fecha hasta"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <CalendarComponent
                                    mode="single"
                                    selected={fechaHasta}
                                    onSelect={setFechaHasta}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-teal" />
                            Rango de montos
                          </h3>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Monto mínimo"
                                value={montoMinimo}
                                onChange={(e) => setMontoMinimo(e.target.value)}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Monto máximo"
                                value={montoMaximo}
                                onChange={(e) => setMontoMaximo(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          className="bg-teal hover:bg-teal/90"
                          onClick={aplicarFiltros}
                        >
                          Aplicar filtros
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recaudos Pendientes</CardTitle>
                    <CardDescription>
                      {recaudos.length} recaudos encontrados
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Columns className="h-4 w-4 mr-2" />
                        Columnas
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {columnas.map((columna) => (
                        <DropdownMenuCheckboxItem
                          key={columna.id}
                          checked={columna.isVisible}
                          onCheckedChange={() => toggleColumnaVisibilidad(columna.id)}
                        >
                          {columna.header}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columnasOrdenadas.map((columna) => (
                          <TableHead
                            key={columna.id}
                            className={`${
                              columnaDrag === columna.id ? "bg-gray-100" : ""
                            } cursor-grab`}
                            draggable
                            onDragStart={() => handleDragStart(columna.id)}
                            onDragOver={(e) => handleDragOver(e, columna.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex items-center">
                              <GripVertical className="h-4 w-4 mr-1 opacity-50" />
                              {columna.header}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recaudos.length > 0 ? (
                        recaudos.map((recaudo) => (
                          <TableRow key={recaudo.id}>
                            {columnasOrdenadas.map((columna) => {
                              if (columna.id === "id") {
                                return (
                                  <TableCell key={columna.id} className="font-medium">
                                    {recaudo.id}
                                  </TableCell>
                                );
                              } else if (columna.id === "cliente") {
                                return (
                                  <TableCell key={columna.id}>
                                    <div className="flex items-center gap-2">
                                      <Building className="h-4 w-4 text-gray-400" />
                                      {recaudo.cliente}
                                    </div>
                                  </TableCell>
                                );
                              } else if (columna.id === "factura") {
                                return (
                                  <TableCell key={columna.id}>
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-400" />
                                      {recaudo.factura}
                                    </div>
                                  </TableCell>
                                );
                              } else if (columna.id === "monto") {
                                return (
                                  <TableCell key={columna.id} className="text-right">
                                    <span className="font-semibold text-gray-700">
                                      ${recaudo.monto.toLocaleString()}
                                    </span>
                                  </TableCell>
                                );
                              } else if (columna.id === "fechaVencimiento") {
                                return (
                                  <TableCell key={columna.id}>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-400" />
                                      {new Date(recaudo.fechaVencimiento).toLocaleDateString()}
                                    </div>
                                  </TableCell>
                                );
                              } else if (columna.id === "estado") {
                                return (
                                  <TableCell key={columna.id}>
                                    <Badge
                                      variant="outline"
                                      className={`cursor-pointer hover:opacity-80 transition-opacity ${
                                        recaudo.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                                      } ${
                                        recaudo.estado === "En proceso" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""
                                      } ${
                                        recaudo.estado === "Vencido" ? "bg-red-100 text-red-800 hover:bg-red-100" : ""
                                      }`}
                                      onClick={() => abrirCambioEstado(recaudo)}
                                    >
                                      {recaudo.estado === "Pendiente" && (
                                        <Clock className="mr-1 h-3 w-3" />
                                      )}
                                      {recaudo.estado === "En proceso" && (
                                        <Check className="mr-1 h-3 w-3" />
                                      )}
                                      {recaudo.estado === "Vencido" && (
                                        <AlertCircle className="mr-1 h-3 w-3" />
                                      )}
                                      {recaudo.estado}
                                      {recaudo.diasVencido > 0 && ` (${recaudo.diasVencido} días)`}
                                    </Badge>
                                  </TableCell>
                                );
                              } else if (columna.id === "acciones") {
                                return (
                                  <TableCell key={columna.id} className="text-right">
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                                        onClick={() => verDetalleRecaudo(recaudo)}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ver
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="bg-green-50 text-green-600 hover:bg-green-100"
                                        size="sm"
                                        onClick={() => abrirCambioEstado(recaudo)}
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Estado
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className="bg-teal/10 text-teal hover:bg-teal/20 hover:text-teal-600"
                                        size="sm"
                                        onClick={() => confirmarPago(recaudo)}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Pagado
                                      </Button>
                                    </div>
                                  </TableCell>
                                );
                              }
                              return <TableCell key={columna.id}></TableCell>;
                            })}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columnasOrdenadas.length} className="text-center py-6 text-muted-foreground">
                            No hay recaudos que coincidan con los filtros.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Diálogo para mostrar detalles del recaudo */}
            <Dialog open={mostrarDetalle} onOpenChange={setMostrarDetalle}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Detalle del Recaudo</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  {recaudoSeleccionado && (
                    <div>
                      <div className="flex justify-end mb-4">
                        <Button 
                          variant="outline" 
                          className="bg-green-50 text-green-600 hover:bg-green-100"
                          onClick={handlePrint}
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                      </div>
                      
                      <div ref={impresionRef} className="p-6 bg-white">
                        <div className="border-b pb-4 mb-4">
                          <h2 className="text-2xl font-bold text-gray-800">{recaudoSeleccionado.id}</h2>
                          <div className="flex justify-between mt-2">
                            <div>
                              <h3 className="font-semibold text-lg">{recaudoSeleccionado.cliente}</h3>
                              <p className="text-gray-600">{recaudoSeleccionado.detalles?.direccion}</p>
                              <p className="text-gray-600">{recaudoSeleccionado.detalles?.telefono}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600">Factura: {recaudoSeleccionado.factura}</p>
                              <p className="text-gray-600">
                                Fecha de vencimiento: {new Date(recaudoSeleccionado.fechaVencimiento).toLocaleDateString()}
                              </p>
                              <Badge
                                variant="outline"
                                className={`
                                  ${recaudoSeleccionado.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" : ""}
                                  ${recaudoSeleccionado.estado === "En proceso" ? "bg-blue-100 text-blue-800" : ""}
                                  ${recaudoSeleccionado.estado === "Vencido" ? "bg-red-100 text-red-800" : ""}
                                `}
                              >
                                {recaudoSeleccionado.estado}
                                {recaudoSeleccionado.diasVencido > 0 && ` (${recaudoSeleccionado.diasVencido} días)`}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="font-semibold text-lg mb-2">Detalles de los Artículos</h3>
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Artículo</th>
                                <th className="border p-2 text-right">Cantidad</th>
                                <th className="border p-2 text-right">Precio Unitario</th>
                                <th className="border p-2 text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {recaudoSeleccionado.detalles?.articulos.map((articulo, index) => (
                                <tr key={index} className="border-b">
                                  <td className="border p-2">{articulo.nombre}</td>
                                  <td className="border p-2 text-right">{articulo.cantidad}</td>
                                  <td className="border p-2 text-right">${articulo.precio.toLocaleString()}</td>
                                  <td className="border p-2 text-right">${(articulo.cantidad * articulo.precio).toLocaleString()}</td>
                                </tr>
                              ))}
                              <tr className="font-semibold">
                                <td colSpan={3} className="border p-2 text-right">Total:</td>
                                <td className="border p-2 text-right">${recaudoSeleccionado.monto.toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Método de Pago</h3>
                            <p>{recaudoSeleccionado.detalles?.metodoPago}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-2">Notas</h3>
                            <p>{recaudoSeleccionado.detalles?.notas}</p>
                          </div>
                        </div>

                        <div className="border-t pt-4 text-center text-sm text-gray-500">
                          <p>Este documento es un comprobante de recaudo y no tiene validez como factura.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación para marcar como pagado */}
            <AlertDialog open={mostrarPagoConfirmacion} onOpenChange={setMostrarPagoConfirmacion}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar pago</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro de que desea marcar este recaudo como pagado? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-teal hover:bg-teal/90"
                    onClick={() => recaudoSeleccionado && marcarComoPagado(recaudoSeleccionado.id)}
                  >
                    Confirmar pago
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Diálogo para cambiar estado */}
            <Dialog open={mostrarCambioEstado} onOpenChange={setMostrarCambioEstado}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar Estado del Recaudo</DialogTitle>
                  <DialogDescription>
                    Seleccione el nuevo estado para este recaudo
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <RadioGroup value={nuevoEstado} onValueChange={setNuevoEstado}>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="Pendiente" id="pendiente" />
                      <Label htmlFor="pendiente" className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                        Pendiente
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="En proceso" id="proceso" />
                      <Label htmlFor="proceso" className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-blue-500" />
                        En proceso
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <RadioGroupItem value="Vencido" id="vencido" />
                      <Label htmlFor="vencido" className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        Vencido
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pagado" id="pagado" />
                      <Label htmlFor="pagado" className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        Pagado
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMostrarCambioEstado(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-teal hover:bg-teal/90"
                    onClick={cambiarEstado}
                  >
                    Guardar cambios
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeguimientoRecaudos;
