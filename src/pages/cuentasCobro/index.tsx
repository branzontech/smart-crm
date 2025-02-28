
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { cuentaCobroService } from "@/services/cuentaCobroService";
import { CuentaCobro } from "@/types/cuentacobro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CuentaCobroViewer } from "@/components/cuentasCobro/CuentaCobroViewer";

export default function CuentasCobro() {
  const [cuentas, setCuentas] = useState<CuentaCobro[]>([]);
  const [filteredCuentas, setFilteredCuentas] = useState<CuentaCobro[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<CuentaCobro["estado"] | "todas">("todas");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaCobro | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos
    const data = cuentaCobroService.getAll();
    setCuentas(data);
    setFilteredCuentas(data);
  }, []);

  useEffect(() => {
    // Aplicar filtros cuando cambian
    let result = cuentas;
    
    // Filtrar por búsqueda
    if (searchQuery) {
      result = cuentaCobroService.search(searchQuery);
    }
    
    // Filtrar por estado
    if (filtroEstado !== "todas") {
      result = result.filter(cuenta => cuenta.estado === filtroEstado);
    }
    
    setFilteredCuentas(result);
  }, [searchQuery, filtroEstado, cuentas]);

  const getStatusBadge = (estado: CuentaCobro["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "pagada":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Pagada</Badge>;
      case "vencida":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Vencida</Badge>;
      case "anulada":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Anulada</Badge>;
    }
  };

  const getStatusIcon = (estado: CuentaCobro["estado"]) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "pagada":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "vencida":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "anulada":
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container pt-[var(--header-height)]">
        <Header />
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Cuentas de Cobro</h1>
                <p className="text-gray-500">Gestiona y consulta cuentas de cobro</p>
              </div>
              <Button 
                onClick={() => navigate("/cuentas-cobro/nueva")}
                className="bg-teal hover:bg-teal/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Nueva cuenta de cobro
              </Button>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar cuentas de cobro..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      className="border rounded-md p-2 text-sm"
                      value={filtroEstado}
                      onChange={(e) => setFiltroEstado(e.target.value as any)}
                    >
                      <option value="todas">Todos los estados</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="pagada">Pagada</option>
                      <option value="vencida">Vencida</option>
                      <option value="anulada">Anulada</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCuentas.length > 0 ? (
                      filteredCuentas.map((cuenta) => (
                        <TableRow key={cuenta.id}>
                          <TableCell className="font-medium">{cuenta.id}</TableCell>
                          <TableCell>{cuenta.fechaEmision}</TableCell>
                          <TableCell>{cuenta.receptor.empresa}</TableCell>
                          <TableCell className="max-w-xs truncate">{cuenta.servicio.descripcion}</TableCell>
                          <TableCell>
                            ${new Intl.NumberFormat('es-CO').format(cuenta.valor.monto)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(cuenta.estado)}
                              {getStatusBadge(cuenta.estado)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setCuentaSeleccionada(cuenta)}
                                >
                                  <FileText className="h-4 w-4 mr-1" /> Ver
                                </Button>
                              </DialogTrigger>
                              {cuentaSeleccionada && (
                                <CuentaCobroViewer cuenta={cuentaSeleccionada} />
                              )}
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                          No se encontraron cuentas de cobro
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
