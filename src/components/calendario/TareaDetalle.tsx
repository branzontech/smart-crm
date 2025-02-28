
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
  Tag
} from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold">{tarea.titulo}</h3>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleCompletada}
            className={tarea.completada ? "bg-green-50 text-green-700" : ""}
          >
            {tarea.completada ? (
              <>
                <Check className="mr-1 h-4 w-4" /> Completada
              </>
            ) : (
              <>
                <X className="mr-1 h-4 w-4" /> Pendiente
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {tarea.descripcion && (
        <p className="text-gray-600">{tarea.descripcion}</p>
      )}

      <div className="space-y-2 pt-2">
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

        <div className="flex items-center text-sm">
          <Tag className="h-4 w-4 mr-2 text-gray-500" />
          <div className="flex items-center">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: calendarioService.getColorCategoria(tarea.categoria) }}
            ></span>
            <span className="capitalize">{tarea.categoria}</span>
            <span className="mx-2">•</span>
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: calendarioService.getColorPrioridad(tarea.prioridad) }}
            ></span>
            <span className="capitalize">Prioridad {tarea.prioridad}</span>
          </div>
        </div>

        <div className="flex items-start text-sm">
          <Users className="h-4 w-4 mr-2 mt-1 text-gray-500" />
          <div className="flex flex-wrap gap-1">
            {agentes.map(agente => (
              <span 
                key={agente.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: `${agente.color}20`,
                  color: agente.color,
                  border: `1px solid ${agente.color}40`
                }}
              >
                {agente.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
