
import React from "react";
import { CalendarioTarea } from "@/types/calendario";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { format } from "date-fns";
import { Plus, Calendar as CalendarIcon, CheckCircle2, Clock } from "lucide-react";

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

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">
          {fecha ? (
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-teal" />
              {format(fecha, "EEEE, d 'de' MMMM")}
            </div>
          ) : (
            "Próximas Tareas"
          )}
        </CardTitle>
        <Button onClick={onAgregarTarea} className="bg-teal hover:bg-teal/90">
          <Plus className="h-4 w-4 mr-1" /> Agregar
        </Button>
      </CardHeader>
      <CardContent>
        {tareasOrdenadas.length > 0 ? (
          <div className="space-y-2">
            {tareasOrdenadas.map((tarea) => (
              <div
                key={tarea.id}
                className={`flex items-center p-3 border rounded-lg transition-colors duration-150 ${
                  tarea.completada 
                    ? "bg-gray-50 border-gray-200" 
                    : "hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => onSeleccionarTarea(tarea)}
              >
                <div
                  className="w-1 h-10 rounded-full mr-3 self-stretch"
                  style={{ 
                    backgroundColor: tarea.completada 
                      ? "#A0AEC0" 
                      : calendarioServiceDB.getColorPrioridad(tarea.prioridad) 
                  }}
                ></div>
                <Checkbox
                  checked={tarea.completada}
                  onCheckedChange={(checked) => {
                    onCambiarEstado(tarea, checked as boolean);
                    // Detener la propagación para evitar que se abra el detalle de la tarea
                    event?.stopPropagation();
                  }}
                  className="mr-3"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <h3 
                    className={`font-medium ${
                      tarea.completada ? "text-gray-500 line-through" : "text-gray-900"
                    }`}
                  >
                    {tarea.titulo}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    {!tarea.todoElDia && (
                      <div className="flex items-center mr-3">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatoHora(tarea.fechaInicio)}
                        {tarea.fechaFin && ` - ${formatoHora(tarea.fechaFin)}`}
                      </div>
                    )}
                    {tarea.todoElDia && (
                      <div className="mr-3">Todo el día</div>
                    )}
                    <Badge 
                      variant="outline" 
                      className="text-xs mr-2"
                      style={{ 
                        color: calendarioServiceDB.getColorCategoria(tarea.categoria),
                        borderColor: calendarioServiceDB.getColorCategoria(tarea.categoria),
                        backgroundColor: `${calendarioServiceDB.getColorCategoria(tarea.categoria)}10`
                      }}
                    >
                      {tarea.categoria}
                    </Badge>
                    
                    {/* Mostrar los primeros 2 agentes con avatar o iniciales */}
                    {tarea.agentes.length > 0 && (
                      <div className="flex -space-x-1 overflow-hidden ml-auto">
                        {tarea.agentes.slice(0, 2).map((agenteId) => {
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
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[8px] text-white overflow-hidden"
                              style={{ backgroundColor: color }}
                              title={nombre}
                            >
                              {iniciales}
                            </div>
                          );
                        })}
                        {tarea.agentes.length > 2 && (
                          <div
                            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-[8px] text-gray-600"
                            title="Más usuarios"
                          >
                            +{tarea.agentes.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {tarea.completada && (
                      <div className="ml-auto flex items-center text-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completada
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {fecha 
              ? "No hay tareas para esta fecha" 
              : "No hay tareas pendientes"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
