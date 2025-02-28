
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Calendar as CalendarIcon, Plus, Filter, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { CalendarioTarea } from "@/types/calendario";
import { calendarioService } from "@/services/calendarioService";
import { CalendarioMensual } from "@/components/calendario/CalendarioMensual";
import { ListaTareas } from "@/components/calendario/ListaTareas";
import { TareaDetalle } from "@/components/calendario/TareaDetalle";
import { TareaForm } from "@/components/calendario/TareaForm";
import { AgentesSelector } from "@/components/calendario/AgentesSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

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

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    let resultado = [...tareas];
    
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
  }, [tareas, agentesSeleccionados, filtroEstado, filtroCategoria]);

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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container pt-[var(--header-height)]">
        <Header />
        <main className="flex-1 content-container">
          <div className="max-w-content">
            {/* Cabecera */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-teal" />
                <h1 className="text-2xl font-semibold text-gray-900">Calendario</h1>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Filtro de estado */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Estado
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filtroEstado === "todos"}
                      onCheckedChange={() => setFiltroEstado("todos")}
                    >
                      Todas
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filtroEstado === "pendientes"}
                      onCheckedChange={() => setFiltroEstado("pendientes")}
                    >
                      Pendientes
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filtroEstado === "completadas"}
                      onCheckedChange={() => setFiltroEstado("completadas")}
                    >
                      Completadas
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Filtro de categoría */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Categoría
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por categoría</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filtroCategoria.includes("reunion")}
                      onCheckedChange={() => handleCambioCategoria("reunion")}
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("reunion") }}
                        ></span>
                        Reunión
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filtroCategoria.includes("entrega")}
                      onCheckedChange={() => handleCambioCategoria("entrega")}
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("entrega") }}
                        ></span>
                        Entrega
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filtroCategoria.includes("seguimiento")}
                      onCheckedChange={() => handleCambioCategoria("seguimiento")}
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("seguimiento") }}
                        ></span>
                        Seguimiento
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filtroCategoria.includes("otro")}
                      onCheckedChange={() => handleCambioCategoria("otro")}
                    >
                      <span className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("otro") }}
                        ></span>
                        Otro
                      </span>
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Botón para agregar tarea */}
                <Button onClick={handleAgregarTarea} className="bg-teal hover:bg-teal/90">
                  <Plus className="h-4 w-4 mr-2" /> Nueva tarea
                </Button>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-6">
                {/* Calendario mensual */}
                <CalendarioMensual
                  fecha={fecha}
                  tareas={tareasFiltradas}
                  onFechaSeleccionada={setFecha}
                />
                
                {/* Selector de agentes */}
                <AgentesSelector
                  agentesSeleccionados={agentesSeleccionados}
                  onCambiarSeleccion={handleCambioAgente}
                />
                
                {/* Leyenda */}
                <Card className="p-4">
                  <h3 className="text-sm font-medium mb-3">Leyenda</h3>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium mb-2">Categorías</div>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("reunion") }}
                        ></span>
                        Reunión
                      </div>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("entrega") }}
                        ></span>
                        Entrega
                      </div>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("seguimiento") }}
                        ></span>
                        Seguimiento
                      </div>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorCategoria("otro") }}
                        ></span>
                        Otro
                      </div>
                    </div>
                    
                    <div className="font-medium mb-2 mt-4">Prioridades</div>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorPrioridad("alta") }}
                        ></span>
                        Alta
                      </div>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorPrioridad("media") }}
                        ></span>
                        Media
                      </div>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: calendarioService.getColorPrioridad("baja") }}
                        ></span>
                        Baja
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Columna derecha - Lista de tareas */}
              <div className="md:col-span-2">
                <ListaTareas
                  tareas={tareasFiltradas}
                  fecha={fecha}
                  onAgregarTarea={handleAgregarTarea}
                  onSeleccionarTarea={handleSeleccionarTarea}
                  onCambiarEstado={handleCambiarEstadoTarea}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Diálogo para ver detalles de una tarea */}
      <Dialog 
        open={!!tareaSeleccionada && !mostrarFormulario} 
        onOpenChange={(open) => !open && setTareaSeleccionada(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la tarea</DialogTitle>
          </DialogHeader>
          {tareaSeleccionada && (
            <TareaDetalle
              tarea={tareaSeleccionada}
              onEdit={handleEditarTarea}
              onDelete={handleEliminarTarea}
              onToggleCompletada={() => 
                handleCambiarEstadoTarea(tareaSeleccionada, !tareaSeleccionada.completada)
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear/editar una tarea */}
      <Dialog 
        open={mostrarFormulario} 
        onOpenChange={(open) => !open && setMostrarFormulario(false)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {tareaSeleccionada ? "Editar tarea" : "Nueva tarea"}
            </DialogTitle>
            <DialogDescription>
              {tareaSeleccionada 
                ? "Modifica los detalles de la tarea" 
                : "Completa el formulario para crear una nueva tarea"}
            </DialogDescription>
          </DialogHeader>
          <TareaForm
            tareaInicial={tareaSeleccionada || undefined}
            onSubmit={handleGuardarTarea}
            onCancel={() => setMostrarFormulario(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarioIndex;
