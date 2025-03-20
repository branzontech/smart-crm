
import React from "react";
import { CalendarioTarea } from "@/types/calendario";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Calendar as CalendarIcon, CheckCircle2, Clock } from "lucide-react";
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
    ? tareas.filter((tarea) =>
        format(new Date(tarea.fechaInicio), "yyyy-MM-dd") ===
        format(fecha, "yyyy-MM-dd")
      )
    : tareas;

  // Ordenar tareas: primero las no completadas, luego por fecha y prioridad
  const tareasOrdenadas = [...tareasFiltradas].sort((a, b) => {
    if (a.completada !== b.completada) {
      return a.completada ? 1 : -1;
    }
    
    if (a.fechaInicio.getTime() !== b.fechaInicio.getTime()) {
      return a.fechaInicio.getTime() - b.fechaInicio.getTime();
    }
    
    const prioridadValor = { alta: 0, media: 1, baja: 2 };
    return prioridadValor[a.prioridad] - prioridadValor[b.prioridad];
  });

  const formatoHora = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatoFecha = (date: Date) => {
    return format(date, "EEEE d", { locale: es });
  };

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="border-b flex flex-row items-center justify-between py-4 px-5 bg-gray-50">
        <CardTitle className="text-xl font-medium">
          {fecha ? (
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
              {format(fecha, "d MMM", { locale: es })}
            </div>
          ) : (
            "Todas las Tareas"
          )}
        </CardTitle>
        <Button onClick={onAgregarTarea} size="sm" className="bg-primary hover:bg-primary/90 rounded-full" variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <Tabs defaultValue="pendientes" className="flex-1 flex flex-col h-full">
        <TabsList className="grid grid-cols-2 m-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="pendientes" className="rounded-md">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas" className="rounded-md">Completadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendientes" className="flex-1 overflow-y-auto p-3">
          {tareasOrdenadas.filter(t => !t.completada).length > 0 ? (
            <div className="space-y-2">
              {tareasOrdenadas.filter(t => !t.completada).map((tarea) => (
                <TareaItem 
                  key={tarea.id}
                  tarea={tarea}
                  onSeleccionarTarea={onSeleccionarTarea}
                  onCambiarEstado={onCambiarEstado}
                  getNombreUsuario={getNombreUsuario}
                  getColorUsuario={getColorUsuario}
                  formatoHora={formatoHora}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
              <p>No hay tareas pendientes</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completadas" className="flex-1 overflow-y-auto p-3">
          {tareasOrdenadas.filter(t => t.completada).length > 0 ? (
            <div className="space-y-2">
              {tareasOrdenadas.filter(t => t.completada).map((tarea) => (
                <TareaItem 
                  key={tarea.id}
                  tarea={tarea}
                  onSeleccionarTarea={onSeleccionarTarea}
                  onCambiarEstado={onCambiarEstado}
                  getNombreUsuario={getNombreUsuario}
                  getColorUsuario={getColorUsuario}
                  formatoHora={formatoHora}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
              <CheckCircle2 className="h-12 w-12 mb-3 opacity-20" />
              <p>No hay tareas completadas</p>
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
}

const TareaItem = ({
  tarea,
  onSeleccionarTarea,
  onCambiarEstado,
  getNombreUsuario,
  getColorUsuario,
  formatoHora
}: TareaItemProps) => {
  return (
    <div
      className="flex items-start p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 border border-gray-100 shadow-sm bg-white cursor-pointer"
      onClick={() => onSeleccionarTarea(tarea)}
    >
      <div className="mr-3 mt-1">
        <Checkbox
          checked={tarea.completada}
          onCheckedChange={(checked) => {
            onCambiarEstado(tarea, checked as boolean);
            // Detener la propagación para evitar que se abra el detalle de la tarea
            event?.stopPropagation();
          }}
          className="rounded-full"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 
            className={`font-medium truncate ${
              tarea.completada ? "text-gray-500 line-through" : "text-gray-900"
            }`}
          >
            {tarea.titulo}
          </h3>
          <Badge 
            variant="outline" 
            className={`ml-2 text-xs shrink-0 ${tarea.completada ? 'opacity-60' : ''}`}
            style={{ 
              color: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
              borderColor: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
              backgroundColor: `${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}15`
            }}
          >
            {tarea.prioridad}
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1 gap-2">
          {!tarea.todoElDia ? (
            <div className="flex items-center mr-1">
              <Clock className="h-3 w-3 mr-1" />
              {formatoHora(tarea.fechaInicio)}
              {tarea.fechaFin && ` - ${formatoHora(tarea.fechaFin)}`}
            </div>
          ) : (
            <div className="flex items-center mr-1">
              <Clock className="h-3 w-3 mr-1" />
              Todo el día
            </div>
          )}
          
          <Badge 
            variant="outline" 
            className="text-xs"
            style={{ 
              color: calendarioServiceDB.getColorCategoria(tarea.categoria),
              borderColor: calendarioServiceDB.getColorCategoria(tarea.categoria),
              backgroundColor: `${calendarioServiceDB.getColorCategoria(tarea.categoria)}15`
            }}
          >
            {tarea.categoria}
          </Badge>
        </div>
        
        {/* Mostrar los agentes asignados solo si hay alguno */}
        {tarea.agentes.length > 0 && (
          <div className="flex -space-x-1 overflow-hidden mt-2">
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
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] text-white overflow-hidden border-2 border-white"
                  style={{ backgroundColor: color }}
                  title={nombre}
                >
                  {iniciales}
                </div>
              );
            })}
            {tarea.agentes.length > 3 && (
              <div
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-[10px] text-gray-600 border-2 border-white"
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
