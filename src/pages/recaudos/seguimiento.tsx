
import { useState } from "react";
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
import { ArrowLeft, Check, Coins, Search, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Datos ficticios de recaudos pendientes o en proceso
const recaudosPendientes = [
  {
    id: "REC-2023-001",
    cliente: "Tech Solutions SA",
    factura: "FAC-2023-045",
    monto: 15000,
    fechaVencimiento: "2023-11-15",
    estado: "Pendiente",
    diasVencido: 0
  },
  {
    id: "REC-2023-002",
    cliente: "Green Energy Corp",
    factura: "FAC-2023-032",
    monto: 45000,
    fechaVencimiento: "2023-10-25",
    estado: "Vencido",
    diasVencido: 21
  },
  {
    id: "REC-2023-003",
    cliente: "Global Logistics",
    factura: "FAC-2023-018",
    monto: 28500,
    fechaVencimiento: "2023-11-05",
    estado: "En proceso",
    diasVencido: 0
  },
  {
    id: "REC-2023-004",
    cliente: "Digital Systems Inc",
    factura: "FAC-2023-067",
    monto: 12800,
    fechaVencimiento: "2023-11-30",
    estado: "Pendiente",
    diasVencido: 0
  },
  {
    id: "REC-2023-005",
    cliente: "Smart Solutions",
    factura: "FAC-2023-039",
    monto: 35600,
    fechaVencimiento: "2023-10-15",
    estado: "Vencido",
    diasVencido: 31
  }
];

const SeguimientoRecaudos = () => {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("");
  const [estado, setEstado] = useState("todos");
  const [recaudos, setRecaudos] = useState(recaudosPendientes);

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
    
    setRecaudos(recaudosFiltrados);
  };

  // Efecto para aplicar filtros
  const handleFiltroBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro(e.target.value);
    filtrarRecaudos();
  };

  const handleFiltroEstado = (value: string) => {
    setEstado(value);
    setTimeout(filtrarRecaudos, 0);
  };

  // Función para marcar como pagado
  const marcarComoPagado = (id: string) => {
    // Aquí se enviaría la actualización a la API
    toast.success(`Recaudo ${id} marcado como pagado`);
    
    // Actualizamos el estado local
    const recaudosActualizados = recaudos.filter(recaudo => recaudo.id !== id);
    setRecaudos(recaudosActualizados);
  };

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
                      defaultValue="todos"
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recaudos Pendientes</CardTitle>
                <CardDescription>
                  {recaudos.length} recaudos encontrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Factura</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead>Vencimiento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recaudos.length > 0 ? (
                        recaudos.map((recaudo) => (
                          <TableRow key={recaudo.id}>
                            <TableCell className="font-medium">
                              {recaudo.id}
                            </TableCell>
                            <TableCell>{recaudo.cliente}</TableCell>
                            <TableCell>{recaudo.factura}</TableCell>
                            <TableCell className="text-right">
                              ${recaudo.monto.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {new Date(recaudo.fechaVencimiento).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`
                                  ${recaudo.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""}
                                  ${recaudo.estado === "En proceso" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
                                  ${recaudo.estado === "Vencido" ? "bg-red-100 text-red-800 hover:bg-red-100" : ""}
                                `}
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
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                className="bg-teal/10 text-teal hover:bg-teal/20 hover:text-teal-600"
                                onClick={() => marcarComoPagado(recaudo.id)}
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Marcar como Pagado
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No hay recaudos que coincidan con los filtros.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SeguimientoRecaudos;
