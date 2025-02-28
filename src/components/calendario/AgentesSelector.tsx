
import React from "react";
import { Agente } from "@/types/calendario";
import { Checkbox } from "@/components/ui/checkbox";
import { calendarioService } from "@/services/calendarioService";

interface AgentesSelectorProps {
  agentesSeleccionados: string[];
  onCambiarSeleccion: (agenteId: string, seleccionado: boolean) => void;
}

export const AgentesSelector = ({
  agentesSeleccionados,
  onCambiarSeleccion,
}: AgentesSelectorProps) => {
  const agentes = calendarioService.getAgentes();

  return (
    <div className="space-y-2">
      {agentes.map((agente) => (
        <div 
          key={agente.id}
          className="flex items-center space-x-2"
        >
          <Checkbox
            checked={agentesSeleccionados.includes(agente.id)}
            onCheckedChange={(checked) => {
              onCambiarSeleccion(agente.id, checked as boolean);
            }}
            id={`agente-${agente.id}`}
          />
          <label 
            htmlFor={`agente-${agente.id}`}
            className="text-sm flex items-center cursor-pointer"
          >
            <span 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: agente.color }}
            ></span>
            {agente.nombre}
          </label>
        </div>
      ))}
    </div>
  );
};
