
import { CalendarioTarea } from "@/types/calendario";
import { calendarioService } from "@/services/calendarioService";
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
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TareaDetalleProps {
  tarea: CalendarioTarea;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompletada: () => void;
}

export const TareaDetalle = ({ 
  tarea, 
  onEdit, 
  onDelete, 
  onToggleCompletada 
}: TareaDetalleProps) => {
  const agentes = calendarioService.getAgentes().filter(a => 
    tarea.agentes.includes(a.id)
  );

  const formatoFecha = (fecha: Date) => {
    return format(fecha, "EEEE d 'de' MMMM, yyyy", { locale: es });
  };

  const formatoHora = (fecha: Date) => {
    return format(fecha, "h:mm a");
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{tarea.titulo}</h3>
          <Badge 
            variant={tarea.completada ? "success" : "secondary"}
            className="ml-2 cursor-pointer"
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
          <p className="text-gray-600">{tarea.descripcion}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-3 rounded-md space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {formatoFecha(tarea.fechaInicio)}
              {tarea.fechaFin && tarea.fechaInicio.toDateString() !== tarea.fechaFin.toDateString() && (
                <> - {formatoFecha(tarea.fechaFin)}</>
              )}
            </span>
          </div>

          {!tarea.todoElDia && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {formatoHora(tarea.fechaInicio)}
                {tarea.fechaFin && (
                  <> - {formatoHora(tarea.fechaFin)}</>
                )}
              </span>
            </div>
          )}
          
          {tarea.todoElDia && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Todo el día</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-sm">
          <Tag className="h-4 w-4 mr-2 text-gray-500" />
          <div className="flex items-center">
            <Badge 
              variant="outline" 
              className="mr-2"
              style={{ 
                color: calendarioService.getColorCategoria(tarea.categoria),
                borderColor: calendarioService.getColorCategoria(tarea.categoria),
                backgroundColor: `${calendarioService.getColorCategoria(tarea.categoria)}10`
              }}
            >
              <span className="capitalize">{tarea.categoria}</span>
            </Badge>
            
            <Badge 
              variant="outline"
              style={{ 
                color: calendarioService.getColorPrioridad(tarea.prioridad),
                borderColor: calendarioService.getColorPrioridad(tarea.prioridad),
                backgroundColor: `${calendarioService.getColorPrioridad(tarea.prioridad)}10`
              }}
            >
              {tarea.prioridad === 'alta' && <AlertTriangle className="mr-1 h-3 w-3" />}
              <span className="capitalize">Prioridad {tarea.prioridad}</span>
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>Agentes asignados ({agentes.length})</span>
          </div>
          
          <div className="flex flex-wrap gap-2 pl-6">
            {agentes.map(agente => (
              <div 
                key={agente.id}
                className="flex items-center px-3 py-2 rounded-md"
                style={{ 
                  backgroundColor: `${agente.color}15`,
                  color: agente.color,
                }}
              >
                <div 
                  className="w-5 h-5 rounded-full mr-2 flex items-center justify-center text-[10px] text-white"
                  style={{ backgroundColor: agente.color }}
                >
                  {agente.nombre.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>
                {agente.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
        <Button 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
      </div>
    </div>
  );
};
