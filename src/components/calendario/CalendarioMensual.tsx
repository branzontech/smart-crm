
import React, { useState, useEffect } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarioTarea } from "@/types/calendario";
import { calendarioService } from "@/services/calendarioService";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarioMensualProps {
  fecha: Date;
  tareas: CalendarioTarea[];
  onFechaSeleccionada: (fecha: Date) => void;
}

export const CalendarioMensual = ({ 
  fecha, 
  tareas, 
  onFechaSeleccionada 
}: CalendarioMensualProps) => {
  // Personalización del calendario
  const calendarioDiasPersonalizados = (date: Date) => {
    // Encontrar tareas para este día
    const tareasDelDia = tareas.filter(tarea => 
      isSameDay(new Date(tarea.fechaInicio), date)
    );
    
    if (tareasDelDia.length === 0) return null;

    // Categorías de las tareas para este día
    const categorias = new Set(tareasDelDia.map(t => t.categoria));
    
    // Tareas completadas vs pendientes
    const completadas = tareasDelDia.filter(t => t.completada).length;
    const pendientes = tareasDelDia.length - completadas;
    
    // Generar puntos de colores para cada categoría
    return (
      <div className="flex justify-center mt-1 space-x-1">
        {Array.from(categorias).slice(0, 3).map((cat, idx) => (
          <div 
            key={idx} 
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: calendarioService.getColorCategoria(cat as any) }}
          />
        ))}
        {categorias.size > 3 && (
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
        )}
        {pendientes > 0 && completadas > 0 && (
          <div className="absolute bottom-1 right-1 text-[8px] text-gray-500">
            {completadas}/{tareasDelDia.length}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <CalendarUI
          mode="single"
          selected={fecha}
          onSelect={(date) => date && onFechaSeleccionada(date)}
          locale={es}
          components={{
            DayContent: (props) => (
              <div className="relative">
                {props.date.getDate()}
                {calendarioDiasPersonalizados(props.date)}
              </div>
            ),
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};
