
import React from "react";
import { CalendarioSubtarea } from "@/types/calendario";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, Calendar, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SubtareasListProps {
  subtareas: CalendarioSubtarea[];
  onToggleCompletada: (subtareaId: string, completada: boolean) => void;
  onEliminar: (subtareaId: string) => void;
  readOnly?: boolean;
}

export const SubtareasList = ({
  subtareas,
  onToggleCompletada,
  onEliminar,
  readOnly = false
}: SubtareasListProps) => {
  if (!subtareas || subtareas.length === 0) {
    return (
      <div className="text-gray-500 text-sm mt-2 italic">
        No hay subtareas
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      {subtareas.map((subtarea) => (
        <div 
          key={subtarea.id} 
          className={`flex items-start p-3 rounded-lg border ${
            subtarea.completada ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
          }`}
        >
          <div className="mr-3 mt-1">
            <Checkbox
              checked={subtarea.completada}
              onCheckedChange={(checked) => 
                onToggleCompletada(subtarea.id, checked as boolean)
              }
              disabled={readOnly}
              className="rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 
              className={`font-medium truncate ${
                subtarea.completada ? "text-gray-500 line-through" : "text-gray-900"
              }`}
            >
              {subtarea.titulo}
            </h4>
            {subtarea.descripcion && (
              <p className="text-sm text-gray-600 mt-1">
                {subtarea.descripcion}
              </p>
            )}
            {subtarea.fechaCumplimiento && (
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                {format(subtarea.fechaCumplimiento, "d MMM", { locale: es })}
                <Clock className="h-3 w-3 ml-2 mr-1" />
                {format(subtarea.fechaCumplimiento, "HH:mm", { locale: es })}
              </div>
            )}
          </div>
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-500"
              onClick={() => onEliminar(subtarea.id)}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
