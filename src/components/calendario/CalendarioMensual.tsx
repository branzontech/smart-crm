
import React, { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarioTarea } from "@/types/calendario";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
            style={{ backgroundColor: calendarioServiceDB.getColorCategoria(cat as any) }}
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

  // Vista diaria
  const renderDiaDetalle = () => {
    const tareasDelDia = tareas.filter(tarea => 
      isSameDay(new Date(tarea.fechaInicio), fecha)
    );
    
    return (
      <div className="p-4 h-full">
        <h3 className="text-lg font-medium mb-4">{format(fecha, "EEEE, d 'de' MMMM", { locale: es })}</h3>
        <div className="space-y-2">
          {tareasDelDia.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay tareas para este día</p>
          ) : (
            tareasDelDia.map(tarea => (
              <div
                key={tarea.id}
                className="p-3 rounded-md border mb-2 cursor-pointer hover:bg-gray-50"
                style={{
                  borderLeft: `4px solid ${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}`
                }}
                onClick={() => onFechaSeleccionada(fecha)}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{tarea.titulo}</span>
                  <Badge variant="outline" 
                    className={tarea.completada ? "bg-green-100 text-green-700" : ""}
                  >
                    {tarea.completada ? "Completada" : "Pendiente"}
                  </Badge>
                </div>
                {!tarea.todoElDia && (
                  <div className="text-sm text-gray-500 mt-1">
                    {format(new Date(tarea.fechaInicio), "HH:mm")}
                    {tarea.fechaFin && ` - ${format(new Date(tarea.fechaFin), "HH:mm")}`}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Vista semanal
  const renderSemanaDetalle = () => {
    const inicioSemana = startOfWeek(fecha, { locale: es });
    const finSemana = endOfWeek(fecha, { locale: es });
    const diasSemana = eachDayOfInterval({ start: inicioSemana, end: finSemana });
    
    return (
      <div className="p-4 h-full">
        <h3 className="text-lg font-medium mb-4">Semana del {format(inicioSemana, "d 'de' MMMM", { locale: es })} al {format(finSemana, "d 'de' MMMM", { locale: es })}</h3>
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((dia, index) => {
            const tareasDelDia = tareas.filter(tarea => 
              isSameDay(new Date(tarea.fechaInicio), dia)
            );
            
            return (
              <div key={index} 
                className={`border rounded-md p-2 min-h-[100px] ${isSameDay(dia, fecha) ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => onFechaSeleccionada(dia)}
              >
                <div className="text-center mb-2 text-sm font-medium">
                  {format(dia, "EEE d", { locale: es })}
                </div>
                <div className="space-y-1">
                  {tareasDelDia.slice(0, 3).map((tarea, idx) => (
                    <div 
                      key={idx} 
                      className="text-xs p-1 rounded truncate"
                      style={{ backgroundColor: `${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}20` }}
                    >
                      {tarea.titulo}
                    </div>
                  ))}
                  {tareasDelDia.length > 3 && (
                    <div className="text-xs text-center text-gray-500">
                      +{tareasDelDia.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <Tabs defaultValue="mes" className="h-full">
          <TabsList className="mb-4 grid grid-cols-3 w-full">
            <TabsTrigger value="dia">Día</TabsTrigger>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="mes">Mes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dia" className="h-[500px] overflow-y-auto">
            {renderDiaDetalle()}
          </TabsContent>
          
          <TabsContent value="semana" className="h-[500px] overflow-y-auto">
            {renderSemanaDetalle()}
          </TabsContent>
          
          <TabsContent value="mes">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
