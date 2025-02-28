
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth
} from "date-fns";
import { es } from "date-fns/locale";
import { CalendarioTarea } from "@/types/calendario";
import { calendarioService } from "@/services/calendarioService";
import { ListaTareas } from "@/components/calendario/ListaTareas";
import { TareaDetalle } from "@/components/calendario/TareaDetalle";
import { TareaForm } from "@/components/calendario/TareaForm";
import { AgentesSelector } from "@/components/calendario/AgentesSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Users,
  Search,
  Filter,
  LayoutGrid,
  List,
  Settings2,
  CalendarDays,
  SidebarClose,
  SidebarOpen
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CalendarioIndex = () => {
  // Estados para manejar el calendario y las tareas
  const [fecha, setFecha] = useState<Date>(new Date());
  const [tareas, setTareas] = useState<CalendarioTarea[]>([]);
  const [tareasFiltradas, setTareasFiltradas] = useState<CalendarioTarea[]>([]);
  const [tareaSeleccionada, setTareaSeleccionada] = useState<CalendarioTarea | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [agentesSeleccionados, setAgentesSeleccionados] = useState<string[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string[]>([]);
  const [modoVista, setModoVista] = useState<"semana" | "mes" | "lista">("semana");
  const [busqueda, setBusqueda] = useState<string>("");
  
  // Estado para controlar la visibilidad del panel lateral
  const [mostrarPanel, setMostrarPanel] = useState<boolean>(false);
  
  // Referencia para detectar cuando el mouse entra en la zona de activación
  const zonaActivacionRef = useRef<HTMLDivElement>(null);
  const panelLateralRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  // Cargar tareas al iniciar
  useEffect(() => {
    const tareasCargadas = calendarioService.getTareas();
    setTareas(tareasCargadas);
    
    // Por defecto, seleccionar todos los agentes
    const todosAgentes = calendarioService.getAgentes().map(a => a.id);
    setAgentesSeleccionados(todosAgentes);
    
    // Por defecto, mostrar todas las categorías
    setFiltroCategoria(["reunion", "entrega", "seguimiento", "otro"]);
  }, []);
  
  // Manejar eventos de mouse para mostrar/ocultar el panel lateral
  useEffect(() => {
    const handleMouseEnter = () => {
      setMostrarPanel(true);
    };
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Verificar si el mouse está dentro del panel lateral o la zona de activación
      if (panelLateralRef.current && !panelLateralRef.current.contains(e.relatedTarget as Node) &&
          zonaActivacionRef.current && !zonaActivacionRef.current.contains(e.relatedTarget as Node)) {
        setMostrarPanel(false);
      }
    };
    
    const zonaActivacion = zonaActivacionRef.current;
    const panelLateral = panelLateralRef.current;
    
    if (zonaActivacion) {
      zonaActivacion.addEventListener('mouseenter', handleMouseEnter);
    }
    
    if (panelLateral) {
      panelLateral.addEventListener('mouseleave', handleMouseLeave as EventListener);
    }
    
    return () => {
      if (zonaActivacion) {
        zonaActivacion.removeEventListener('mouseenter', handleMouseEnter);
      }
      
      if (panelLateral) {
        panelLateral.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      }
    };
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    let resultado = [...tareas];
    
    // Filtrar por término de búsqueda
    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(tarea => 
        tarea.titulo.toLowerCase().includes(terminoBusqueda) || 
        (tarea.descripcion && tarea.descripcion.toLowerCase().includes(terminoBusqueda))
      );
    }
    
    // Filtrar por agentes
    if (agentesSeleccionados.length > 0) {
      resultado = resultado.filter(tarea => 
        tarea.agentes.some(agenteId => agentesSeleccionados.includes(agenteId))
      );
    }
    
    // Filtrar por estado
    if (filtroEstado !== "todos") {
      resultado = resultado.filter(tarea => 
        filtroEstado === "completadas" ? tarea.completada : !tarea.completada
      );
    }
    
    // Filtrar por categoría
    if (filtroCategoria.length > 0) {
      resultado = resultado.filter(tarea => 
        filtroCategoria.includes(tarea.categoria)
      );
    }
    
    setTareasFiltradas(resultado);
  }, [tareas, agentesSeleccionados, filtroEstado, filtroCategoria, busqueda]);

  // Manejar la selección de tarea para ver detalles
  const handleSeleccionarTarea = (tarea: CalendarioTarea) => {
    setTareaSeleccionada(tarea);
  };

  // Manejar cambio de estado de una tarea (completada/pendiente)
  const handleCambiarEstadoTarea = (tarea: CalendarioTarea, completada: boolean) => {
    const tareaActualizada = calendarioService.cambiarEstadoTarea(tarea.id, completada);
    if (tareaActualizada) {
      // Actualizar la lista de tareas
      setTareas(prevTareas =>
        prevTareas.map(t =>
          t.id === tarea.id ? { ...t, completada } : t
        )
      );
      
      // Si es la tarea seleccionada, actualizarla también
      if (tareaSeleccionada && tareaSeleccionada.id === tarea.id) {
        setTareaSeleccionada({ ...tareaSeleccionada, completada });
      }
      
      toast({
        title: `Tarea ${completada ? 'completada' : 'pendiente'}`,
        description: tarea.titulo,
      });
    }
  };

  // Manejar agregar nueva tarea
  const handleAgregarTarea = () => {
    setTareaSeleccionada(null);
    setMostrarFormulario(true);
  };

  // Manejar editar tarea existente
  const handleEditarTarea = () => {
    setMostrarFormulario(true);
  };

  // Manejar eliminar tarea
  const handleEliminarTarea = () => {
    if (!tareaSeleccionada) return;
    
    const eliminado = calendarioService.eliminarTarea(tareaSeleccionada.id);
    if (eliminado) {
      setTareas(prevTareas => 
        prevTareas.filter(t => t.id !== tareaSeleccionada.id)
      );
      setTareaSeleccionada(null);
      
      toast({
        title: "Tarea eliminada",
        description: "La tarea ha sido eliminada exitosamente",
      });
    }
  };

  // Manejar guardar tarea (crear o actualizar)
  const handleGuardarTarea = (datosTarea: Partial<CalendarioTarea>) => {
    if (tareaSeleccionada) {
      // Actualizar tarea existente
      const tareaActualizada = calendarioService.actualizarTarea(
        tareaSeleccionada.id,
        datosTarea
      );
      
      if (tareaActualizada) {
        setTareas(prevTareas =>
          prevTareas.map(t =>
            t.id === tareaSeleccionada.id ? tareaActualizada : t
          )
        );
        setTareaSeleccionada(tareaActualizada);
        
        toast({
          title: "Tarea actualizada",
          description: "La tarea ha sido actualizada exitosamente",
        });
      }
    } else {
      // Crear nueva tarea
      const nuevaTarea = calendarioService.crearTarea(datosTarea as Omit<CalendarioTarea, 'id'>);
      setTareas(prevTareas => [...prevTareas, nuevaTarea]);
      
      toast({
        title: "Tarea creada",
        description: "La nueva tarea ha sido creada exitosamente",
      });
    }
    
    setMostrarFormulario(false);
  };

  // Manejar cambios en la selección de agentes para filtrado
  const handleCambioAgente = (agenteId: string, seleccionado: boolean) => {
    if (seleccionado) {
      setAgentesSeleccionados(prev => [...prev, agenteId]);
    } else {
      setAgentesSeleccionados(prev => prev.filter(id => id !== agenteId));
    }
  };

  // Manejar cambios en el filtro de categorías
  const handleCambioCategoria = (categoria: string) => {
    setFiltroCategoria(prev => {
      if (prev.includes(categoria)) {
        return prev.filter(c => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  // Generar días de la semana para vista semanal
  const generarDiasSemana = () => {
    const inicioSemana = startOfWeek(fecha, { weekStartsOn: 1 }); // Semana comienza el lunes
    const diasSemana = [];
    
    for (let i = 0; i < 7; i++) {
      const dia = addDays(inicioSemana, i);
      diasSemana.push(dia);
    }
    
    return diasSemana;
  };
  
  // Generar días del mes para vista mensual
  const generarDiasMes = () => {
    const inicioMes = startOfMonth(fecha);
    const finMes = endOfMonth(fecha);
    
    // Obtener el primer día de la semana que contiene el inicio del mes
    const inicioCalendario = startOfWeek(inicioMes, { weekStartsOn: 1 });
    
    // Obtener el último día de la semana que contiene el fin del mes
    const finCalendario = endOfWeek(finMes, { weekStartsOn: 1 });
    
    // Generar todos los días entre el inicio y fin del calendario
    return eachDayOfInterval({ start: inicioCalendario, end: finCalendario });
  };

  // Obtener tareas para un día específico
  const getTareasParaDia = (dia: Date) => {
    return tareasFiltradas.filter(tarea => 
      isSameDay(new Date(tarea.fechaInicio), dia)
    );
  };

  // Navegación entre semanas
  const irSemanaSiguiente = () => {
    setFecha(addWeeks(fecha, 1));
  };

  const irSemanaAnterior = () => {
    setFecha(subWeeks(fecha, 1));
  };
  
  // Navegación entre meses
  const irMesSiguiente = () => {
    setFecha(addMonths(fecha, 1));
  };

  const irMesAnterior = () => {
    setFecha(subMonths(fecha, 1));
  };

  const irAHoy = () => {
    setFecha(new Date());
  };

  // Formatear rango de fechas para mostrar en la cabecera según vista
  const formatoRangoFechas = () => {
    if (modoVista === 'semana') {
      const inicio = startOfWeek(fecha, { weekStartsOn: 1 });
      const fin = endOfWeek(fecha, { weekStartsOn: 1 });
      return `${format(inicio, 'dd MMM', { locale: es })} - ${format(fin, 'dd MMM yyyy', { locale: es })}`;
    } else if (modoVista === 'mes') {
      return format(fecha, 'MMMM yyyy', { locale: es });
    }
    return '';
  };

  const formatoDia = (dia: Date) => {
    const hoy = new Date();
    const esHoy = isSameDay(dia, hoy);
    const esMismoMes = isSameMonth(dia, fecha);
    
    return (
      <div className={`text-center ${esHoy ? 'font-bold' : ''} ${!esMismoMes ? 'opacity-40' : ''}`}>
        <div className="text-xs uppercase text-gray-500">{format(dia, 'EEE', { locale: es })}</div>
        <div className={`text-xl ${esHoy ? 'text-blue-600' : ''}`}>{format(dia, 'dd')}</div>
      </div>
    );
  };
  
  // Navegar entre modos de visualización previo/siguiente
  const navegarAnterior = () => {
    if (modoVista === 'semana') {
      irSemanaAnterior();
    } else if (modoVista === 'mes') {
      irMesAnterior();
    }
  };
  
  const navegarSiguiente = () => {
    if (modoVista === 'semana') {
      irSemanaSiguiente();
    } else if (modoVista === 'mes') {
      irMesSiguiente();
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Navbar />
      <div className="main-container pt-[var(--header-height)]">
        <Header />
        <main className="flex-1 content-container py-4">
          <div className="max-w-content">
            {/* Cabecera */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-semibold text-gray-900">Calendario de Tareas</h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar tareas..." 
                    className="pl-8 w-full md:w-60"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                
                <Select defaultValue="todos" onValueChange={setFiltroEstado}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="pendientes">Pendientes</SelectItem>
                    <SelectItem value="completadas">Completadas</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Categoría
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {["reunion", "entrega", "seguimiento", "otro"].map((cat) => (
                      <DropdownMenuCheckboxItem
                        key={cat}
                        checked={filtroCategoria.includes(cat)}
                        onCheckedChange={() => handleCambioCategoria(cat)}
                      >
                        <span className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: calendarioService.getColorCategoria(cat as any) }}
                          ></span>
                          <span className="capitalize">{cat}</span>
                        </span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="hidden md:flex border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`px-3 ${modoVista === 'semana' ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => setModoVista('semana')}
                    title="Vista semanal"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`px-3 ${modoVista === 'mes' ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => setModoVista('mes')}
                    title="Vista mensual"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`px-3 ${modoVista === 'lista' ? 'bg-blue-50 text-blue-600' : ''}`}
                    onClick={() => setModoVista('lista')}
                    title="Vista lista"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAgregarTarea} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" /> Tarea
                </Button>
              </div>
            </div>

            {/* Vista principal */}
            <Tabs value={modoVista} onValueChange={(valor) => setModoVista(valor as "semana" | "mes" | "lista")} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={navegarAnterior}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={irAHoy}>
                    Hoy
                  </Button>
                  <Button variant="outline" size="sm" onClick={navegarSiguiente}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-medium mx-4">
                    {formatoRangoFechas()}
                  </div>
                </div>
                <TabsList className="hidden md:flex">
                  <TabsTrigger value="semana">Semana</TabsTrigger>
                  <TabsTrigger value="mes">Mes</TabsTrigger>
                  <TabsTrigger value="lista">Lista</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="semana" className="mt-0">
                <div className="bg-white rounded-lg border">
                  {/* Cabecera de días */}
                  <div className="grid grid-cols-7 border-b">
                    {generarDiasSemana().map((dia, i) => (
                      <div 
                        key={i} 
                        className={`px-2 py-3 text-center border-r last:border-r-0 ${
                          isSameDay(dia, new Date()) ? 'bg-blue-50' : ''
                        }`}
                      >
                        {formatoDia(dia)}
                      </div>
                    ))}
                  </div>
                  
                  {/* Contenido del calendario */}
                  <div className="grid grid-cols-7 h-[calc(100vh-280px)] overflow-y-auto">
                    {generarDiasSemana().map((dia, i) => {
                      const tareasDelDia = getTareasParaDia(dia);
                      return (
                        <div 
                          key={i} 
                          className={`p-2 border-r last:border-r-0 min-h-[120px] ${
                            isSameDay(dia, new Date()) ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {tareasDelDia.length > 0 ? (
                            <div className="space-y-2">
                              {tareasDelDia.map(tarea => (
                                <div
                                  key={tarea.id}
                                  className={`p-2 rounded-md text-xs cursor-pointer transition-colors ${
                                    tarea.completada 
                                      ? 'bg-gray-100 text-gray-500' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                  style={{
                                    borderLeft: `3px solid ${calendarioService.getColorCategoria(tarea.categoria)}`,
                                    backgroundColor: `${calendarioService.getColorCategoria(tarea.categoria)}10`
                                  }}
                                  onClick={() => handleSeleccionarTarea(tarea)}
                                >
                                  <div className="font-medium truncate">{tarea.titulo}</div>
                                  {!tarea.todoElDia && (
                                    <div className="text-[10px] text-gray-600">
                                      {format(tarea.fechaInicio, 'HH:mm')}
                                      {tarea.fechaFin && ` - ${format(tarea.fechaFin, 'HH:mm')}`}
                                    </div>
                                  )}
                                  {tarea.agentes.length > 0 && (
                                    <div className="flex mt-1 -space-x-1">
                                      {tarea.agentes.slice(0, 3).map(agenteId => {
                                        const agente = calendarioService.getAgenteById(agenteId);
                                        if (!agente) return null;
                                        return (
                                          <div
                                            key={agenteId}
                                            className="w-4 h-4 rounded-full border border-white"
                                            style={{ backgroundColor: agente.color }}
                                            title={agente.nombre}
                                          ></div>
                                        );
                                      })}
                                      {tarea.agentes.length > 3 && (
                                        <div
                                          className="w-4 h-4 rounded-full bg-gray-200 text-[8px] flex items-center justify-center"
                                          title="Más agentes"
                                        >
                                          +{tarea.agentes.length - 3}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div 
                              className="h-full flex items-center justify-center text-gray-400 text-xs cursor-pointer"
                              onClick={() => {
                                setFecha(dia);
                                handleAgregarTarea();
                              }}
                            >
                              <div className="text-center">
                                <Plus className="h-4 w-4 mx-auto mb-1" />
                                <span>Agregar</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
              
              {/* Vista mensual */}
              <TabsContent value="mes" className="mt-0">
                <div className="bg-white rounded-lg border">
                  {/* Cabecera de días */}
                  <div className="grid grid-cols-7 border-b">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia, i) => (
                      <div 
                        key={i} 
                        className="px-2 py-3 text-center border-r last:border-r-0 font-medium text-sm uppercase"
                      >
                        {dia}
                      </div>
                    ))}
                  </div>
                  
                  {/* Contenido del calendario mensual */}
                  <div className="grid grid-cols-7 auto-rows-fr h-[calc(100vh-280px)] overflow-y-auto">
                    {generarDiasMes().map((dia, i) => {
                      const tareasDelDia = getTareasParaDia(dia);
                      const esMismoMes = isSameMonth(dia, fecha);
                      const esHoy = isSameDay(dia, new Date());
                      
                      return (
                        <div 
                          key={i} 
                          className={`p-1 border-r border-b last:border-r-0 ${
                            esHoy ? 'bg-blue-50/30' : ''
                          } ${!esMismoMes ? 'bg-gray-50/50 text-gray-400' : ''}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-medium ${esHoy ? 'text-blue-600' : ''}`}>
                              {format(dia, 'dd')}
                            </span>
                            <button
                              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 hidden group-hover:block"
                              onClick={() => {
                                setFecha(dia);
                                handleAgregarTarea();
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="space-y-1 overflow-y-auto max-h-[80px]">
                            {tareasDelDia.slice(0, 3).map(tarea => (
                              <div
                                key={tarea.id}
                                className={`px-1 py-0.5 rounded text-[10px] truncate cursor-pointer ${
                                  tarea.completada ? 'line-through text-gray-400' : ''
                                }`}
                                style={{
                                  backgroundColor: `${calendarioService.getColorCategoria(tarea.categoria)}15`,
                                  color: calendarioService.getColorCategoria(tarea.categoria)
                                }}
                                onClick={() => handleSeleccionarTarea(tarea)}
                              >
                                {tarea.titulo}
                              </div>
                            ))}
                            {tareasDelDia.length > 3 && (
                              <div 
                                className="text-[10px] text-gray-500 cursor-pointer hover:underline"
                                onClick={() => {
                                  setFecha(dia);
                                  setModoVista('semana');
                                }}
                              >
                                +{tareasDelDia.length - 3} más...
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="lista" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="border-b p-4 bg-gray-50 flex items-center justify-between">
                      <div className="font-medium">Todas las tareas</div>
                      <div className="text-sm text-gray-500">{tareasFiltradas.length} tareas</div>
                    </div>
                    <div className="divide-y max-h-[calc(100vh-280px)] overflow-y-auto">
                      {tareasFiltradas.length > 0 ? (
                        tareasFiltradas
                          .sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime())
                          .map(tarea => (
                            <div
                              key={tarea.id}
                              className="p-4 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSeleccionarTarea(tarea)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={tarea.completada}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleCambiarEstadoTarea(tarea, e.target.checked);
                                      }}
                                      className="mr-3 h-4 w-4 rounded border-gray-300"
                                    />
                                    <h3 className={`font-medium ${tarea.completada ? 'line-through text-gray-500' : ''}`}>
                                      {tarea.titulo}
                                    </h3>
                                  </div>
                                  {tarea.descripcion && (
                                    <p className="text-gray-600 text-sm mt-1 ml-7 line-clamp-1">
                                      {tarea.descripcion}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <div>
                                    {format(tarea.fechaInicio, 'dd MMM', { locale: es })}
                                  </div>
                                  <div 
                                    className="px-2 py-1 rounded text-xs"
                                    style={{
                                      backgroundColor: `${calendarioService.getColorCategoria(tarea.categoria)}20`,
                                      color: calendarioService.getColorCategoria(tarea.categoria)
                                    }}
                                  >
                                    {tarea.categoria}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center mt-2 ml-7">
                                <div className="text-xs text-gray-500 flex items-center mr-4">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(tarea.fechaInicio, 'dd MMM yyyy', { locale: es })}
                                </div>
                                {!tarea.todoElDia && (
                                  <div className="text-xs text-gray-500">
                                    {format(tarea.fechaInicio, 'HH:mm')}
                                    {tarea.fechaFin && ` - ${format(tarea.fechaFin, 'HH:mm')}`}
                                  </div>
                                )}
                                {tarea.todoElDia && (
                                  <div className="text-xs text-gray-500">
                                    Todo el día
                                  </div>
                                )}
                                {tarea.agentes.length > 0 && (
                                  <div className="flex ml-auto -space-x-1">
                                    {tarea.agentes.map(agenteId => {
                                      const agente = calendarioService.getAgenteById(agenteId);
                                      if (!agente) return null;
                                      
                                      const iniciales = agente.nombre
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2);
                                        
                                      return (
                                        <div
                                          key={agenteId}
                                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] text-white"
                                          style={{ backgroundColor: agente.color }}
                                          title={agente.nombre}
                                        >
                                          {iniciales}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No hay tareas que coincidan con los filtros
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Botón para mostrar panel lateral (zona de activación) */}
            <div 
              ref={zonaActivacionRef}
              className="fixed right-0 top-[calc(var(--header-height)+20px)] h-12 w-12 flex items-center justify-center bg-white border-l border-t border-b rounded-l-md shadow-sm cursor-pointer transition-all hover:bg-gray-50"
              title="Mostrar panel de filtros"
            >
              <SidebarOpen className="h-5 w-5 text-gray-500" />
            </div>

            {/* Panel lateral */}
            <div 
              ref={panelLateralRef}
              className={`fixed right-0 top-[var(--header-height)] h-full w-64 border-l bg-white shadow-sm p-4 transform transition-transform duration-300 ${
                mostrarPanel ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <h3 className="font-medium">Agentes</h3>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMostrarPanel(false)}
                >
                  <SidebarClose className="h-4 w-4" />
                </button>
              </div>
              
              <AgentesSelector
                agentesSeleccionados={agentesSeleccionados}
                onCambiarSeleccion={handleCambioAgente}
              />
              
              <div className="mt-6">
                <div className="flex items-center mb-4">
                  <Settings2 className="h-4 w-4 mr-2 text-gray-500" />
                  <h3 className="font-medium">Leyenda</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Categorías</div>
                    <div className="grid grid-cols-1 gap-y-1">
                      {["reunion", "entrega", "seguimiento", "otro"].map(cat => (
                        <div key={cat} className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: calendarioService.getColorCategoria(cat as any) }}
                          ></span>
                          <span className="capitalize">{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Prioridades</div>
                    <div className="grid grid-cols-1 gap-y-1">
                      {["alta", "media", "baja"].map(prio => (
                        <div key={prio} className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: calendarioService.getColorPrioridad(prio as any) }}
                          ></span>
                          <span className="capitalize">{prio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Panel lateral para detalles de tarea */}
      <Sheet 
        open={!!tareaSeleccionada} 
        onOpenChange={(open) => !open && setTareaSeleccionada(null)}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalles de la tarea</SheetTitle>
            <SheetDescription>
              Ver y gestionar los detalles de la tarea
            </SheetDescription>
          </SheetHeader>
          {tareaSeleccionada && (
            <div className="mt-6">
              <TareaDetalle
                tarea={tareaSeleccionada}
                onEdit={handleEditarTarea}
                onDelete={handleEliminarTarea}
                onToggleCompletada={() => 
                  handleCambiarEstadoTarea(tareaSeleccionada, !tareaSeleccionada.completada)
                }
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Panel para crear/editar tarea */}
      <Sheet 
        open={mostrarFormulario} 
        onOpenChange={(open) => !open && setMostrarFormulario(false)}
      >
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {tareaSeleccionada ? "Editar tarea" : "Nueva tarea"}
            </SheetTitle>
            <SheetDescription>
              {tareaSeleccionada 
                ? "Modifica los detalles de la tarea" 
                : "Completa el formulario para crear una nueva tarea"}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 pb-20 overflow-y-auto pr-1"> {/* Área desplazable para el formulario */}
            <TareaForm
              tareaInicial={tareaSeleccionada || undefined}
              onSubmit={handleGuardarTarea}
              onCancel={() => setMostrarFormulario(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarioIndex;
