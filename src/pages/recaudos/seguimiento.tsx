
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Grid, List, MessageCircle, Calendar, DollarSign, AlertCircle, Download, Filter, User, Check, Package, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EstadoRecaudo = "Pendiente" | "En Proceso" | "Pagado" | "Vencido" | "Cancelado";

type Articulo = {
  nombre: string;
  cantidad: number;
};

type Recaudo = {
  id: number;
  numeroRecaudo: string;
  cliente: string;
  agente: string;
  estado: EstadoRecaudo;
  monto: number;
  fechaCreacion: string;
  fechaVencimiento: string;
  diasRestantes?: number;
  prioridad?: string;
  ultimaGestion?: string;
  ultimaObservacion?: string;
  metodoPago?: string;
  historialContacto?: Array<{ fecha: string; nota: string }>;
  proveedor: string;
  articulos: Articulo[];
};

const recaudosData: Recaudo[] = [
  {
    id: 1,
    numeroRecaudo: "REC-001",
    cliente: "Tech Solutions SA",
    agente: "Juan Pérez",
    estado: "Pendiente",
    monto: 25000,
    fechaCreacion: "2024-03-15",
    fechaVencimiento: "2024-04-15",
    diasRestantes: 15,
    prioridad: "Alta",
    ultimaGestion: "2024-03-20",
    ultimaObservacion: "Cliente solicitó prórroga de 5 días",
    metodoPago: "Transferencia",
    historialContacto: [
      { fecha: "2024-03-18", nota: "Primera llamada realizada" },
      { fecha: "2024-03-20", nota: "Cliente solicitó prórroga" }
    ],
    proveedor: "Suministros Express",
    articulos: [
      { nombre: "Laptop Dell XPS", cantidad: 5 },
      { nombre: "Monitor 27'", cantidad: 10 }
    ]
  },
  {
    id: 2,
    numeroRecaudo: "REC-002",
    cliente: "Global Logistics",
    agente: "María García",
    estado: "Pagado",
    monto: 15000,
    fechaCreacion: "2024-03-10",
    fechaVencimiento: "2024-04-10",
    proveedor: "TechPro Solutions",
    articulos: [
      { nombre: "Impresora HP", cantidad: 3 }
    ]
  }
];

export default function SeguimientoRecaudos() {
  const [vista, setVista] = useState<"grid" | "list">("grid");
  const [recaudos, setRecaudos] = useState<Recaudo[]>(recaudosData);
  const [filtros, setFiltros] = useState({
    fechaInicial: "",
    fechaFinal: "",
    cliente: "todos",
    proveedor: "todos",
    periodo: "todo",
  });
  const { toast } = useToast();

  const clientesUnicos = Array.from(new Set(recaudosData.map(r => r.cliente)));
  const proveedoresUnicos = Array.from(new Set(recaudosData.map(r => r.proveedor)));

  useEffect(() => {
    let recaudosFiltrados = [...recaudosData];

    if (filtros.fechaInicial) {
      recaudosFiltrados = recaudosFiltrados.filter(
        r => r.fechaCreacion >= filtros.fechaInicial
      );
    }

    if (filtros.fechaFinal) {
      recaudosFiltrados = recaudosFiltrados.filter(
        r => r.fechaCreacion <= filtros.fechaFinal
      );
    }

    if (filtros.cliente && filtros.cliente !== "todos") {
      recaudosFiltrados = recaudosFiltrados.filter(
        r => r.cliente === filtros.cliente
      );
    }

    if (filtros.proveedor && filtros.proveedor !== "todos") {
      recaudosFiltrados = recaudosFiltrados.filter(
        r => r.proveedor === filtros.proveedor
      );
    }

    if (filtros.periodo === "semana") {
      const hoy = new Date();
      const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()));
      recaudosFiltrados = recaudosFiltrados.filter(
        r => new Date(r.fechaCreacion) >= inicioSemana
      );
    } else if (filtros.periodo === "mes") {
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      recaudosFiltrados = recaudosFiltrados.filter(
        r => new Date(r.fechaCreacion) >= inicioMes
      );
    }

    setRecaudos(recaudosFiltrados);
  }, [filtros]);

  const handleDescargar = () => {
    const datosCSV = recaudos.map(r => ({
      'Número Recaudo': r.numeroRecaudo,
      'Cliente': r.cliente,
      'Proveedor': r.proveedor,
      'Estado': r.estado,
      'Monto': r.monto,
      'Fecha Creación': r.fechaCreacion,
      'Fecha Vencimiento': r.fechaVencimiento,
      'Artículos': r.articulos.map(a => `${a.nombre} (${a.cantidad})`).join(', ')
    }));

    const headers = Object.keys(datosCSV[0]);
    const csv = [
      headers.join(','),
      ...datosCSV.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'recaudos.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Descarga iniciada",
      description: "El archivo CSV se está descargando.",
    });
  };

  const handleEnviarMensaje = (recaudoId: number) => {
    toast({
      title: "Mensaje enviado",
      description: "El agente ha sido notificado sobre el estado del recaudo.",
    });
  };

  const handleMarcarGestion = (recaudoId: number) => {
    toast({
      title: "Gestión registrada",
      description: "La gestión ha sido registrada exitosamente.",
    });
  };

  const handleCambiarEstado = (recaudoId: number, nuevoEstado: EstadoRecaudo) => {
    setRecaudos(prevRecaudos => 
      prevRecaudos.map(recaudo => 
        recaudo.id === recaudoId 
          ? {
              ...recaudo,
              estado: nuevoEstado,
              ultimaGestion: new Date().toISOString().split('T')[0],
              historialContacto: [
                ...(recaudo.historialContacto || []),
                {
                  fecha: new Date().toISOString().split('T')[0],
                  nota: `Estado actualizado a: ${nuevoEstado}`
                }
              ]
            }
          : recaudo
      )
    );

    toast({
      title: "Estado actualizado",
      description: `El recaudo ha sido actualizado a: ${nuevoEstado}`,
    });
  };

  if (!recaudos) {
    return <div>Cargando recaudos...</div>;
  }

  const renderEstadoBadge = (estado: EstadoRecaudo) => {
    const estadoStyles = {
      "Pendiente": "bg-yellow-100 text-yellow-800",
      "En Proceso": "bg-blue-100 text-blue-800",
      "Pagado": "bg-green-100 text-green-800",
      "Vencido": "bg-red-100 text-red-800",
      "Cancelado": "bg-gray-100 text-gray-800"
    };

    return `text-sm px-2 py-0.5 rounded-full ${estadoStyles[estado]}`;
  };

  const renderCardContent = (recaudo: Recaudo) => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Cliente:</span>
        <span className="text-sm font-medium">{recaudo.cliente}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Agente:</span>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">{recaudo.agente}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Monto:</span>
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm">{recaudo.monto.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Vencimiento:</span>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{recaudo.fechaVencimiento}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Estado:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={renderEstadoBadge(recaudo.estado)}>
              {recaudo.estado}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Pendiente")}>
              Pendiente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "En Proceso")}>
              En Proceso
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Pagado")}>
              Pagado
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Vencido")}>
              Vencido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Cancelado")}>
              Cancelado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {recaudo.diasRestantes !== undefined && (
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Días Restantes:</span>
          <span className={`text-sm font-medium ${
            recaudo.diasRestantes <= 5 ? "text-red-600" : "text-gray-600"
          }`}>
            {recaudo.diasRestantes} días
          </span>
        </div>
      )}
      <div className="pt-3 flex gap-2 justify-end border-t">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleEnviarMensaje(recaudo.id)}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleMarcarGestion(recaudo.id)}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Seguimiento de Recaudos</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDescargar}>
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVista("grid")}
                className={vista === "grid" ? "bg-muted" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVista("list")}
                className={vista === "list" ? "bg-muted" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="fechaInicial">Fecha Inicial</Label>
                <Input
                  type="date"
                  id="fechaInicial"
                  value={filtros.fechaInicial}
                  onChange={(e) => setFiltros({...filtros, fechaInicial: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fechaFinal">Fecha Final</Label>
                <Input
                  type="date"
                  id="fechaFinal"
                  value={filtros.fechaFinal}
                  onChange={(e) => setFiltros({...filtros, fechaFinal: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  value={filtros.cliente}
                  onValueChange={(value) => setFiltros({...filtros, cliente: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {clientesUnicos.map((cliente) => (
                      <SelectItem key={cliente} value={cliente}>
                        {cliente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="proveedor">Proveedor</Label>
                <Select
                  value={filtros.proveedor}
                  onValueChange={(value) => setFiltros({...filtros, proveedor: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {proveedoresUnicos.map((proveedor) => (
                      <SelectItem key={proveedor} value={proveedor}>
                        {proveedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="periodo">Periodo</Label>
                <Select
                  value={filtros.periodo}
                  onValueChange={(value) => setFiltros({...filtros, periodo: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="mes">Este mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="todos" className="w-full">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="en-proceso">En Proceso</TabsTrigger>
              <TabsTrigger value="pagados">Pagados</TabsTrigger>
              <TabsTrigger value="vencidos">Vencidos</TabsTrigger>
            </TabsList>

            <TabsContent value="todos" className="mt-6">
              {vista === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recaudos.map((recaudo) => (
                    <Card key={recaudo.id} className="relative">
                      {recaudo.prioridad === "Alta" && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                          <AlertCircle className="h-4 w-4" />
                        </div>
                      )}
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {recaudo.numeroRecaudo}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalles del Recaudo</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Historial de Contacto</h4>
                                    {recaudo.historialContacto?.map((contacto, index) => (
                                      <div key={index} className="text-sm mt-2">
                                        <p className="font-medium">{contacto.fecha}</p>
                                        <p className="text-gray-600">{contacto.nota}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Información Adicional</h4>
                                    <p className="text-sm mt-2">Método de Pago: {recaudo.metodoPago || 'No especificado'}</p>
                                    <p className="text-sm">Última Gestión: {recaudo.ultimaGestion || 'Sin gestiones'}</p>
                                    <p className="text-sm">Observación: {recaudo.ultimaObservacion || 'Sin observaciones'}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {renderCardContent(recaudo)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recaudos.map((recaudo) => (
                    <Card key={recaudo.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              {recaudo.prioridad === "Alta" && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <p className="text-sm font-medium">{recaudo.numeroRecaudo}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{recaudo.cliente}</p>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{recaudo.proveedor}</span>
                            </div>
                          </div>
                          <div className="col-span-3">
                            <div className="flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4 text-gray-500" />
                              <div className="text-sm">
                                {recaudo.articulos.map((articulo, index) => (
                                  <div key={index}>
                                    {articulo.nombre} ({articulo.cantidad} unidades)
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <p className="text-sm font-medium">{recaudo.monto.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">{recaudo.fechaVencimiento}</span>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className={renderEstadoBadge(recaudo.estado)}>
                                  {recaudo.estado}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Pendiente")}>
                                  Pendiente
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "En Proceso")}>
                                  En Proceso
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Pagado")}>
                                  Pagado
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Vencido")}>
                                  Vencido
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCambiarEstado(recaudo.id, "Cancelado")}>
                                  Cancelado
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detalles del Recaudo</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Historial de Contacto</h4>
                                      {recaudo.historialContacto?.map((contacto, index) => (
                                        <div key={index} className="text-sm mt-2">
                                          <p className="font-medium">{contacto.fecha}</p>
                                          <p className="text-gray-600">{contacto.nota}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Información Adicional</h4>
                                      <p className="text-sm mt-2">Método de Pago: {recaudo.metodoPago || 'No especificado'}</p>
                                      <p className="text-sm">Última Gestión: {recaudo.ultimaGestion || 'Sin gestiones'}</p>
                                      <p className="text-sm">Observación: {recaudo.ultimaObservacion || 'Sin observaciones'}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEnviarMensaje(recaudo.id)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleMarcarGestion(recaudo.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pendientes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recaudos.filter(r => r.estado === "Pendiente").map((recaudo) => (
                  <Card key={recaudo.id} className="relative">
                    {recaudo.prioridad === "Alta" && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {recaudo.numeroRecaudo}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Recaudo</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Historial de Contacto</h4>
                                  {recaudo.historialContacto?.map((contacto, index) => (
                                    <div key={index} className="text-sm mt-2">
                                      <p className="font-medium">{contacto.fecha}</p>
                                      <p className="text-gray-600">{contacto.nota}</p>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="font-semibold">Información Adicional</h4>
                                  <p className="text-sm mt-2">Método de Pago: {recaudo.metodoPago || 'No especificado'}</p>
                                  <p className="text-sm">Última Gestión: {recaudo.ultimaGestion || 'Sin gestiones'}</p>
                                  <p className="text-sm">Observación: {recaudo.ultimaObservacion || 'Sin observaciones'}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderCardContent(recaudo)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="en-proceso">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recaudos.filter(r => r.estado === "En Proceso").map((recaudo) => (
                  <Card key={recaudo.id} className="relative">
                    {recaudo.prioridad === "Alta" && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {recaudo.numeroRecaudo}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Recaudo</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Historial de Contacto</h4>
                                  {recaudo.historialContacto?.map((contacto, index) => (
                                    <div key={index} className="text-sm mt-2">
                                      <p className="font-medium">{contacto.fecha}</p>
                                      <p className="text-gray-600">{contacto.nota}</p>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="font-semibold">Información Adicional</h4>
                                  <p className="text-sm mt-2">Método de Pago: {recaudo.metodoPago || 'No especificado'}</p>
                                  <p className="text-sm">Última Gestión: {recaudo.ultimaGestion || 'Sin gestiones'}</p>
                                  <p className="text-sm">Observación: {recaudo.ultimaObservacion || 'Sin observaciones'}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderCardContent(recaudo)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pagados">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recaudos.filter(r => r.estado === "Pagado").map((recaudo) => (
                  <Card key={recaudo.id} className="relative">
                    {recaudo.prioridad === "Alta" && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {recaudo.numeroRecaudo}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Recaudo</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Historial de Contacto</h4>
                                  {recaudo.historialContacto?.map((contacto, index) => (
                                    <div key={index} className="text-sm mt-2">
                                      <p className="font-medium">{contacto.fecha}</p>
                                      <p className="text-gray-600">{contacto.nota}</p>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="font-semibold">Información Adicional</h4>
                                  <p className="text-sm mt-2">Método de Pago: {recaudo.metodoPago || 'No especificado'}</p>
                                  <p className="text-sm">Última Gestión: {recaudo.ultimaGestion || 'Sin gestiones'}</p>
                                  <p className="text-sm">Observación: {recaudo.ultimaObservacion || 'Sin observaciones'}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderCardContent(recaudo)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="vencidos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recaudos.filter(r => r.estado === "Vencido").map((recaudo) => (
                  <Card key={recaudo.id} className="relative">
                    {recaudo.prioridad === "Alta" && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    )}
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {recaudo.numeroRecaudo}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles del Recaudo</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold">Historial de Contacto</h4>
                                  {recaudo.historialContacto?.map((contacto, index) => (
                                    <div key={index} className="text-sm mt-2">
                                      <p className="font-medium">{contacto.fecha}</p>
                                      <p className="text-gray-600">{contacto.nota}</p>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="font-semibold">Información Adicional</h4>
                                  <p className="text-sm mt-2">Método de Pago: {recaudo.metodoPago || 'No especificado'}</p>
                                  <p className="text-sm">Última Gestión: {recaudo.ultimaGestion || 'Sin gestiones'}</p>
                                  <p className="text-sm">Observación: {recaudo.ultimaObservacion || 'Sin observaciones'}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderCardContent(recaudo)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
