
import { CalendarioTarea } from "@/types/calendario";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar,
  Clock, 
  Check, 
  X, 
  Edit, 
  Trash2, 
  Users, 
  Tag,
  AlertTriangle,
  ListTodo
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SubtareasList } from "./SubtareasList";
import { useState } from "react";

interface TareaDetalleProps {
  tarea: CalendarioTarea;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompletada: () => void;
  onToggleSubtarea?: (subtareaId: string, completada: boolean) => void;
  getNombreUsuario: (id: string) => string;
  getColorUsuario: (id: string) => string;
}

export const TareaDetalle = ({ 
  tarea, 
  onEdit, 
  onDelete, 
  onToggleCompletada,
  onToggleSubtarea,
  getNombreUsuario,
  getColorUsuario
}: TareaDetalleProps) => {
  const formatoFecha = (fecha: Date) => {
    return format(fecha, "EEEE d 'de' MMMM, yyyy", { locale: es });
  };

  const formatoHora = (fecha: Date) => {
    return format(fecha, "h:mm a");
  };

  // Handler para subtareas
  const handleSubtareaToggle = (subtareaId: string, completada: boolean) => {
    if (onToggleSubtarea) {
      onToggleSubtarea(subtareaId, completada);
    }
  };

  const subtareas = tarea.subtareas || [];
  const subtareasCompletadas = subtareas.filter(s => s.completada).length;
  const progresoSubtareas = subtareas.length > 0 
    ? Math.round((subtareasCompletadas / subtareas.length) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-semibold">{tarea.titulo}</h3>
          <Badge 
            variant={tarea.completada ? "secondary" : "outline"}
            className={`ml-2 cursor-pointer transition-colors px-3 py-1 ${
              tarea.completada ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'hover:bg-gray-100'
            }`}
            onClick={onToggleCompletada}
          >
            {tarea.completada ? (
              <span className="flex items-center">
                <Check className="mr-1 h-3 w-3" />
                Completada
              </span>
            ) : (
              <span className="flex items-center">
                <X className="mr-1 h-3 w-3" />
                Pendiente
              </span>
            )}
          </Badge>
        </div>
        
        {tarea.descripcion && (
          <p className="text-gray-600 mb-6">{tarea.descripcion}</p>
        )}

        <Separator className="my-6" />

        <div className="space-y-6">
          {/* Sección de detalles principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-primary" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Fecha</div>
                    <div>
                      {formatoFecha(tarea.fechaInicio)}
                      {tarea.fechaFin && tarea.fechaInicio.toDateString() !== tarea.fechaFin.toDateString() && (
                        <> - {formatoFecha(tarea.fechaFin)}</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Hora</div>
                    <div>
                      {tarea.todoElDia ? (
                        "Todo el día"
                      ) : (
                        <>
                          {formatoHora(tarea.fechaInicio)}
                          {tarea.fechaFin && (
                            <> - {formatoHora(tarea.fechaFin)}</>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <Tag className="h-5 w-5 mr-3 text-primary mt-1" />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Detalles</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className="py-1 px-3"
                      style={{ 
                        color: calendarioServiceDB.getColorCategoria(tarea.categoria),
                        borderColor: calendarioServiceDB.getColorCategoria(tarea.categoria),
                        backgroundColor: `${calendarioServiceDB.getColorCategoria(tarea.categoria)}15`
                      }}
                    >
                      <span className="capitalize">{tarea.categoria}</span>
                    </Badge>
                    
                    <Badge 
                      variant="outline"
                      className="py-1 px-3"
                      style={{ 
                        color: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
                        borderColor: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
                        backgroundColor: `${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}15`
                      }}
                    >
                      {tarea.prioridad === 'alta' && <AlertTriangle className="mr-1 h-3 w-3" />}
                      <span className="capitalize">Prioridad {tarea.prioridad}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-primary mt-1" />
                <div className="space-y-3 w-full">
                  <div className="text-sm font-medium">Usuarios asignados ({tarea.agentes.length})</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    {tarea.agentes.map(agenteId => (
                      <div 
                        key={agenteId}
                        className="flex items-center p-2 rounded-md"
                        style={{ 
                          backgroundColor: `${getColorUsuario(agenteId)}15`,
                          color: getColorUsuario(agenteId),
                        }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-xs text-white"
                          style={{ backgroundColor: getColorUsuario(agenteId) }}
                        >
                          {getNombreUsuario(agenteId).split(" ").map(n => n[0]).join("").substring(0, 2)}
                        </div>
                        <div className="font-medium truncate">
                          {getNombreUsuario(agenteId)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {tarea.agentes.length === 0 && (
                    <p className="text-gray-500 text-sm">No hay usuarios asignados</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de subtareas */}
          <div>
            <div className="flex items-center mb-4">
              <ListTodo className="h-5 w-5 mr-3 text-primary" />
              <h3 className="text-base font-medium">Subtareas</h3>
              {subtareas.length > 0 && (
                <span className="ml-auto text-sm text-gray-500">
                  {subtareasCompletadas} de {subtareas.length} completadas ({progresoSubtareas}%)
                </span>
              )}
            </div>

            {subtareas.length > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${progresoSubtareas}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <SubtareasList 
                subtareas={subtareas}
                onToggleCompletada={handleSubtareaToggle}
                onEliminar={() => {}}
                readOnly={true}
              />
              
              {subtareas.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  Esta tarea no tiene subtareas
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
        <Button 
          size="sm"
          className="bg-primary hover:bg-primary/90 gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>
    </div>
  );
};
