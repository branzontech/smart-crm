
import React from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { CalendarioTarea } from "@/types/calendario";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

    // Prioridades de las tareas para este día
    const prioridades = new Set(tareasDelDia.map(t => t.prioridad));
    
    // Tareas completadas vs pendientes
    const completadas = tareasDelDia.filter(t => t.completada).length;
    const pendientes = tareasDelDia.length - completadas;
    
    // Generar indicadores de colores para cada prioridad
    return (
      <div className="absolute bottom-1 left-0 right-0 flex justify-center items-center">
        <div className="flex justify-center space-x-1">
          {Array.from(prioridades).map((prioridad, idx) => (
            <div 
              key={idx} 
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: calendarioServiceDB.getColorPrioridad(prioridad as any) }}
            />
          ))}
        </div>
        
        <div className="absolute bottom-0 right-1 text-[9px] font-medium">
          {tareasDelDia.length > 0 && (
            <span className="text-gray-500">
              {tareasDelDia.length}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Vista diaria
  const renderDiaDetalle = () => {
    const tareasDelDia = tareas.filter(tarea => 
      isSameDay(new Date(tarea.fechaInicio), fecha)
    );
    
    // Agrupar tareas por hora
    const tareasPorHora: { [key: string]: CalendarioTarea[] } = {};
    
    tareasDelDia.forEach(tarea => {
      const hora = tarea.todoElDia 
        ? "Todo el día" 
        : format(new Date(tarea.fechaInicio), "HH:mm");
      
      if (!tareasPorHora[hora]) {
        tareasPorHora[hora] = [];
      }
      
      tareasPorHora[hora].push(tarea);
    });
    
    // Obtener horas ordenadas
    const horas = Object.keys(tareasPorHora).sort((a, b) => {
      if (a === "Todo el día") return -1;
      if (b === "Todo el día") return 1;
      return a.localeCompare(b);
    });
    
    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="text-xl font-medium mb-6 text-center">
          {format(fecha, "EEEE, d 'de' MMMM", { locale: es })}
        </div>
        
        {tareasDelDia.length > 0 ? (
          <div className="space-y-6">
            {horas.map(hora => (
              <div key={hora} className="relative">
                <div className="flex items-center mb-2">
                  <div className="font-medium text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    {hora}
                  </div>
                  <div className="h-px bg-gray-200 flex-1 ml-3"></div>
                </div>
                
                <div className="space-y-2 ml-4">
                  {tareasPorHora[hora].map(tarea => (
                    <div
                      key={tarea.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        tarea.completada 
                          ? "bg-gray-50 border-gray-200" 
                          : "hover:bg-gray-50 hover:shadow-sm"
                      }`}
                      style={{
                        borderLeft: `4px solid ${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}`
                      }}
                      onClick={() => onFechaSeleccionada(fecha)}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${tarea.completada ? "line-through text-gray-500" : ""}`}>
                          {tarea.titulo}
                        </span>
                        <Badge variant="outline" 
                          className={`ml-2 ${tarea.completada ? "bg-green-100 text-green-700" : ""}`}
                        >
                          {tarea.completada ? "Completada" : "Pendiente"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        {!tarea.todoElDia && tarea.fechaFin && (
                          <div>
                            {format(new Date(tarea.fechaInicio), "HH:mm")} - {format(new Date(tarea.fechaFin), "HH:mm")}
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="text-6xl mb-4">📅</div>
            <p>No hay tareas para este día</p>
            <p className="text-sm mt-1">Selecciona otro día o agrega una nueva tarea</p>
          </div>
        )}
      </div>
    );
  };

  // Vista semanal
  const renderSemanaDetalle = () => {
    const inicioSemana = startOfWeek(fecha, { locale: es });
    const finSemana = endOfWeek(fecha, { locale: es });
    const diasSemana = eachDayOfInterval({ start: inicioSemana, end: finSemana });
    
    return (
      <div className="p-6 h-full overflow-y-auto">
        <div className="text-xl font-medium mb-6 text-center">
          Semana del {format(inicioSemana, "d 'de' MMMM", { locale: es })} al {format(finSemana, "d 'de' MMMM", { locale: es })}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Encabezados de días */}
          {diasSemana.map((dia, index) => (
            <div key={`header-${index}`} className="text-center text-sm font-medium py-2">
              {format(dia, "EEE", { locale: es })}
            </div>
          ))}
          
          {/* Celdas con fechas */}
          {diasSemana.map((dia, index) => {
            const tareasDelDia = tareas.filter(tarea => 
              isSameDay(new Date(tarea.fechaInicio), dia)
            );
            
            const esHoy = isToday(dia);
            const esDiaSeleccionado = isSameDay(dia, fecha);
            
            return (
              <div 
                key={`cell-${index}`} 
                className={`border rounded-lg min-h-[150px] p-2 transition-all cursor-pointer 
                  ${esHoy ? 'bg-primary/10 border-primary/30' : ''}
                  ${esDiaSeleccionado ? 'ring-2 ring-primary ring-offset-1' : ''}
                  ${!esHoy && !esDiaSeleccionado ? 'hover:bg-gray-50' : ''}
                `}
                onClick={() => onFechaSeleccionada(dia)}
              >
                <div className={`text-right mb-2 font-medium text-sm ${esHoy ? 'text-primary' : ''}`}>
                  {format(dia, "d")}
                </div>
                
                <div className="space-y-1">
                  {tareasDelDia.slice(0, 3).map((tarea, idx) => (
                    <div 
                      key={idx} 
                      className="text-xs p-1 rounded-sm truncate"
                      style={{ 
                        backgroundColor: `${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}20`,
                        borderLeft: `2px solid ${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}`
                      }}
                    >
                      {tarea.titulo}
                    </div>
                  ))}
                  
                  {tareasDelDia.length > 3 && (
                    <div className="text-xs text-center text-gray-500 mt-1">
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
    <div className="h-full p-0">
      <Tabs defaultValue="mes" className="h-full flex flex-col">
        <div className="px-5 pt-5 border-b">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="dia" className="rounded-md">Día</TabsTrigger>
            <TabsTrigger value="semana" className="rounded-md">Semana</TabsTrigger>
            <TabsTrigger value="mes" className="rounded-md">Mes</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dia" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0">
          {renderDiaDetalle()}
        </TabsContent>
        
        <TabsContent value="semana" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0">
          {renderSemanaDetalle()}
        </TabsContent>
        
        <TabsContent value="mes" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0 p-4">
          <CalendarUI
            mode="single"
            selected={fecha}
            onSelect={(date) => date && onFechaSeleccionada(date)}
            locale={es}
            className="mx-auto max-w-lg"
            classNames={{
              day_today: cn(
                buttonVariants({variant: "outline"}),
                "bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary-foreground"
              ),
              day_selected: cn(
                buttonVariants({variant: "default"}),
                "bg-primary hover:bg-primary"
              ),
              day: cn(
                buttonVariants({variant: "ghost"}),
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative",
                "hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
                "disabled:opacity-50"
              ),
              head_cell: "text-muted-foreground rounded-md font-normal text-[0.8rem] w-9",
              table: "w-full border-collapse space-y-1",
              caption: "flex justify-center pt-2 pb-4 relative items-center",
              caption_label: "text-base font-medium text-primary",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-8 w-8 p-0 opacity-90 hover:opacity-100 hover:bg-primary/10 text-primary"
              )
            }}
            components={{
              DayContent: (props) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  {props.date.getDate()}
                  {calendarioDiasPersonalizados(props.date)}
                </div>
              ),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
