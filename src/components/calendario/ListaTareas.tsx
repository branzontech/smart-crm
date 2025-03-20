
import React from "react";
import { CalendarioTarea } from "@/types/calendario";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Calendar as CalendarIcon, CheckCircle2, Clock, ListFilter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ListaTareasProps {
  tareas: CalendarioTarea[];
  fecha?: Date;
  onAgregarTarea: () => void;
  onSeleccionarTarea: (tarea: CalendarioTarea) => void;
  onCambiarEstado: (tarea: CalendarioTarea, completada: boolean) => void;
  getNombreUsuario?: (id: string) => string;
  getColorUsuario?: (id: string) => string;
}

export const ListaTareas = ({
  tareas,
  fecha,
  onAgregarTarea,
  onSeleccionarTarea,
  onCambiarEstado,
  getNombreUsuario,
  getColorUsuario,
}: ListaTareasProps) => {
  // Si se proporciona una fecha, filtrar tareas para esa fecha
  const tareasFiltradas = fecha
    ? tareas.filter((tarea) => {
        // Asegurarse de que las fechas sean objetos Date
        const fechaInicio = tarea.fechaInicio instanceof Date 
          ? tarea.fechaInicio 
          : new Date(tarea.fechaInicio);
        return isSameDay(fechaInicio, fecha);
      })
    : tareas;

  // Ordenar tareas: primero las no completadas, luego por fecha y prioridad
  const tareasOrdenadas = [...tareasFiltradas].sort((a, b) => {
    if (a.completada !== b.completada) {
      return a.completada ? 1 : -1;
    }
    
    // Asegurarse de que las fechas sean objetos Date
    const fechaInicioA = a.fechaInicio instanceof Date ? a.fechaInicio : new Date(a.fechaInicio);
    const fechaInicioB = b.fechaInicio instanceof Date ? b.fechaInicio : new Date(b.fechaInicio);
    
    if (fechaInicioA.getTime() !== fechaInicioB.getTime()) {
      return fechaInicioA.getTime() - fechaInicioB.getTime();
    }
    
    const prioridadValor = { alta: 0, media: 1, baja: 2 };
    return prioridadValor[a.prioridad] - prioridadValor[b.prioridad];
  });

  const formatoHora = (date: Date) => {
    return format(new Date(date), "HH:mm");
  };

  const formatoFecha = (date: Date) => {
    return format(new Date(date), "EEEE d 'de' MMMM", { locale: es });
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="border-b flex flex-row items-center justify-between py-3 px-4 bg-white shadow-sm">
        <CardTitle className="text-lg font-medium">
          {fecha ? (
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
              {format(fecha, "d MMM, yyyy", { locale: es })}
            </div>
          ) : (
            <div className="flex items-center">
              <ListFilter className="h-5 w-5 mr-2 text-purple-500" />
              Todas las Tareas
            </div>
          )}
        </CardTitle>
        <Button onClick={onAgregarTarea} size="sm" className="bg-purple-600 hover:bg-purple-700 rounded-md h-8 px-3" variant="default">
          <Plus className="h-4 w-4 mr-1" /> Tarea
        </Button>
      </CardHeader>
      
      <Tabs defaultValue="pendientes" className="flex-1 flex flex-col h-full">
        <TabsList className="grid grid-cols-2 mx-4 mt-3 bg-gray-100 p-0.5 rounded-md">
          <TabsTrigger 
            value="pendientes" 
            className="rounded-md text-sm py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Pendientes
          </TabsTrigger>
          <TabsTrigger 
            value="completadas" 
            className="rounded-md text-sm py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Completadas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendientes" className="flex-1 overflow-y-auto p-3">
          {tareasOrdenadas.filter(t => !t.completada).length > 0 ? (
            <div className="space-y-1">
              {tareasOrdenadas.filter(t => !t.completada).map((tarea) => (
                <TareaItem 
                  key={tarea.id}
                  tarea={tarea}
                  onSeleccionarTarea={onSeleccionarTarea}
                  onCambiarEstado={onCambiarEstado}
                  getNombreUsuario={getNombreUsuario}
                  getColorUsuario={getColorUsuario}
                  formatoHora={formatoHora}
                  mostrarFecha={!fecha}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
              <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">No hay tareas pendientes</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completadas" className="flex-1 overflow-y-auto p-3">
          {tareasOrdenadas.filter(t => t.completada).length > 0 ? (
            <div className="space-y-1">
              {tareasOrdenadas.filter(t => t.completada).map((tarea) => (
                <TareaItem 
                  key={tarea.id}
                  tarea={tarea}
                  onSeleccionarTarea={onSeleccionarTarea}
                  onCambiarEstado={onCambiarEstado}
                  getNombreUsuario={getNombreUsuario}
                  getColorUsuario={getColorUsuario}
                  formatoHora={formatoHora}
                  mostrarFecha={!fecha}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
              <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm">No hay tareas completadas</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TareaItemProps {
  tarea: CalendarioTarea;
  onSeleccionarTarea: (tarea: CalendarioTarea) => void;
  onCambiarEstado: (tarea: CalendarioTarea, completada: boolean) => void;
  getNombreUsuario?: (id: string) => string;
  getColorUsuario?: (id: string) => string;
  formatoHora: (date: Date) => string;
  mostrarFecha: boolean;
}

const TareaItem = ({
  tarea,
  onSeleccionarTarea,
  onCambiarEstado,
  getNombreUsuario,
  getColorUsuario,
  formatoHora,
  mostrarFecha
}: TareaItemProps) => {
  // Asegurar que las fechas son objetos Date
  const fechaInicio = tarea.fechaInicio instanceof Date ? tarea.fechaInicio : new Date(tarea.fechaInicio);
  const fechaFin = tarea.fechaFin instanceof Date ? tarea.fechaFin : (tarea.fechaFin ? new Date(tarea.fechaFin) : undefined);

  // Definir colores para prioridades en estilo Asana
  const getPrioridadColor = (prioridad: string) => {
    switch(prioridad) {
      case 'alta': return '#f06a6a'; // rojo para alta prioridad
      case 'media': return '#e5a43b'; // naranja para media prioridad
      case 'baja': return '#4573d2'; // azul para baja prioridad
      default: return '#6c7589'; // gris para sin prioridad
    }
  };

  return (
    <div
      className={`flex items-start p-2 rounded-md transition-all duration-200 hover:bg-gray-50 border-l-2 ${
        tarea.completada ? 'border-l-green-500 bg-gray-50/50' : `border-l-purple-500`
      } mb-1 cursor-pointer group`}
      onClick={() => onSeleccionarTarea(tarea)}
    >
      <div className="mr-2 mt-0.5">
        <Checkbox
          checked={tarea.completada}
          onCheckedChange={(checked) => {
            onCambiarEstado(tarea, checked as boolean);
            // Detener la propagación para evitar que se abra el detalle de la tarea
            event?.stopPropagation();
          }}
          className={`rounded-full border-2 ${
            tarea.completada 
              ? 'border-green-500 bg-green-500 text-white' 
              : 'border-gray-300 hover:border-purple-500'
          }`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 
            className={`font-medium truncate text-base ${
              tarea.completada ? "text-gray-400 line-through" : "text-gray-700"
            }`}
          >
            {tarea.titulo}
          </h3>
          <Badge 
            variant="outline" 
            className={`ml-2 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${tarea.completada ? 'opacity-60' : ''}`}
            style={{ 
              color: getPrioridadColor(tarea.prioridad),
              borderColor: getPrioridadColor(tarea.prioridad),
              backgroundColor: `${getPrioridadColor(tarea.prioridad)}15`
            }}
          >
            {tarea.prioridad}
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1 gap-1">
          {!tarea.todoElDia ? (
            <div className="flex items-center mr-1">
              <Clock className="h-3 w-3 mr-1" />
              {formatoHora(fechaInicio)}
              {fechaFin && ` - ${formatoHora(fechaFin)}`}
            </div>
          ) : (
            <div className="flex items-center mr-1">
              <Clock className="h-3 w-3 mr-1" />
              Todo el día
            </div>
          )}
          
          <Badge 
            variant="outline" 
            className="text-xs py-0 px-1 h-4 inline-flex items-center"
            style={{ 
              color: calendarioServiceDB.getColorCategoria(tarea.categoria),
              borderColor: 'transparent',
              backgroundColor: `${calendarioServiceDB.getColorCategoria(tarea.categoria)}20`
            }}
          >
            {tarea.categoria}
          </Badge>
        </div>

        {/* Mostrar fecha completa para tareas que no son del día seleccionado */}
        {mostrarFecha && (
          <div className="text-xs text-gray-500 mt-1">
            {format(fechaInicio, "d MMM yyyy", { locale: es })}
          </div>
        )}
        
        {/* Mostrar los agentes asignados solo si hay alguno */}
        {tarea.agentes.length > 0 && (
          <div className="flex -space-x-1 overflow-hidden mt-2 opacity-90">
            {tarea.agentes.slice(0, 3).map((agenteId) => {
              const color = getColorUsuario ? getColorUsuario(agenteId) : '#4A90E2';
              const nombre = getNombreUsuario ? getNombreUsuario(agenteId) : '';
              
              const iniciales = nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2);
                
              return (
                <div
                  key={agenteId}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[8px] text-white overflow-hidden border border-white"
                  style={{ backgroundColor: color }}
                  title={nombre}
                >
                  {iniciales}
                </div>
              );
            })}
            {tarea.agentes.length > 3 && (
              <div
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-[8px] text-gray-600 border border-white"
                title="Más usuarios"
              >
                +{tarea.agentes.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
