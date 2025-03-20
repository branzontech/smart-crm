
import React from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { CalendarioTarea } from "@/types/calendario";
import { calendarioServiceDB } from "@/services/calendarioServiceDB";
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, isToday, 
  addDays, differenceInDays, startOfMonth, endOfMonth, isSameMonth,
  addMonths, subMonths, getMonth, getYear
} from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GanttChart, BarChart3 } from "lucide-react";

interface CalendarioMensualProps {
  fecha: Date;
  tareas: CalendarioTarea[];
  onFechaSeleccionada: (fecha: Date) => void;
  onTareaSeleccionada: (tarea: CalendarioTarea) => void;
}

export const CalendarioMensual = ({ 
  fecha, 
  tareas, 
  onFechaSeleccionada,
  onTareaSeleccionada
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
                      onClick={() => onTareaSeleccionada(tarea)}
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
                  {tareasDelDia.slice(0, 3).map((tarea) => (
                    <div 
                      key={tarea.id} 
                      className="text-xs p-1 rounded-sm truncate cursor-pointer hover:bg-gray-100"
                      style={{ 
                        backgroundColor: `${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}20`,
                        borderLeft: `2px solid ${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}`
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTareaSeleccionada(tarea);
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

  // Vista de Gantt
  const renderGanttDetalle = () => {
    // Ordenar tareas por fecha de inicio
    const tareasOrdenadas = [...tareas].sort((a, b) => 
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    );
    
    if (tareasOrdenadas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <GanttChart className="h-16 w-16 mb-4 opacity-20" />
          <p>No hay tareas para mostrar en el diagrama Gantt</p>
          <p className="text-sm mt-1">Agrega nuevas tareas para visualizarlas aquí</p>
        </div>
      );
    }
    
    // Determinar el rango de fechas para el diagrama
    let fechaInicial = new Date(Math.min(...tareasOrdenadas.map(t => new Date(t.fechaInicio).getTime())));
    let fechaFinal = new Date(Math.max(...tareasOrdenadas.map(t => 
      t.fechaFin ? new Date(t.fechaFin).getTime() : new Date(t.fechaInicio).getTime()
    )));
    
    // Asegurar que el rango cubra al menos 14 días
    const rangoMinimo = 14;
    if (differenceInDays(fechaFinal, fechaInicial) < rangoMinimo) {
      fechaFinal = addDays(fechaInicial, rangoMinimo);
    }
    
    // Ajustar el rango para cubrir meses completos
    fechaInicial = startOfMonth(fechaInicial);
    fechaFinal = endOfMonth(fechaFinal);
    
    // Crear array de meses para el encabezado
    const mesesGantt = [];
    let mesActual = new Date(fechaInicial);
    
    while (mesActual <= fechaFinal) {
      mesesGantt.push(new Date(mesActual));
      mesActual = addMonths(mesActual, 1);
    }
    
    // Crear array de días para la visualización detallada
    const diasGantt = [];
    let diaActual = new Date(fechaInicial);
    
    while (diaActual <= fechaFinal) {
      diasGantt.push(new Date(diaActual));
      diaActual = addDays(diaActual, 1);
    }
    
    const anchoColumna = 40; // Ancho en píxeles de cada columna del día
    
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="text-xl font-medium mb-6 flex items-center justify-center">
          <GanttChart className="mr-2 h-5 w-5 text-primary" />
          Diagrama Gantt de Tareas
        </div>
        
        <div className="overflow-x-auto">
          <div style={{ minWidth: `${diasGantt.length * anchoColumna + 300}px` }}>
            {/* Encabezado de meses */}
            <div className="flex border-b">
              <div className="w-[300px] shrink-0 p-2 font-medium border-r">Tarea</div>
              <div className="flex">
                {mesesGantt.map((mes, idx) => {
                  // Calcular el número de días en este mes que están dentro del rango
                  const diasEnMes = diasGantt.filter(dia => 
                    isSameMonth(dia, mes)
                  ).length;
                  
                  return (
                    <div 
                      key={`mes-${idx}`} 
                      className="flex-none text-center text-sm border-r py-1 font-medium bg-gray-100"
                      style={{ width: `${diasEnMes * anchoColumna}px` }}
                    >
                      {format(mes, "MMMM yyyy", { locale: es })}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Encabezado de días */}
            <div className="flex border-b">
              <div className="w-[300px] shrink-0 p-2 font-medium border-r"></div>
              <div className="flex">
                {diasGantt.map((dia, idx) => (
                  <div 
                    key={`dia-${idx}`} 
                    className={`flex-none w-[${anchoColumna}px] text-center text-xs border-r p-1 ${
                      isToday(dia) ? 'bg-primary/10 font-bold' : idx % 2 === 0 ? 'bg-gray-50' : ''
                    }`}
                    style={{ width: `${anchoColumna}px` }}
                  >
                    <div>{format(dia, "dd")}</div>
                    <div className="text-[10px]">{format(dia, "EEE", { locale: es })}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Filas de tareas */}
            <div>
              {tareasOrdenadas.map((tarea, idx) => {
                const fechaInicio = new Date(tarea.fechaInicio);
                const fechaFin = tarea.fechaFin ? new Date(tarea.fechaFin) : new Date(tarea.fechaInicio);
                
                // Calcular posición y ancho de la barra
                const offsetDias = Math.max(0, differenceInDays(fechaInicio, fechaInicial));
                const duracionDias = Math.max(1, differenceInDays(fechaFin, fechaInicio) + 1);
                
                return (
                  <div key={tarea.id} className="flex border-b hover:bg-gray-50">
                    <div 
                      className="w-[300px] shrink-0 p-2 border-r truncate cursor-pointer"
                      onClick={() => onTareaSeleccionada(tarea)}
                    >
                      <div className="font-medium truncate">{tarea.titulo}</div>
                      <div className="flex items-center mt-1 gap-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            color: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
                            borderColor: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
                            backgroundColor: `${calendarioServiceDB.getColorPrioridad(tarea.prioridad)}15`
                          }}
                        >
                          {tarea.prioridad}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {format(fechaInicio, "d MMM", { locale: es })}
                          {fechaFin && fechaInicio.toDateString() !== fechaFin.toDateString() && 
                            ` - ${format(fechaFin, "d MMM", { locale: es })}`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative flex-1 min-h-[60px]">
                      <div 
                        className={`absolute top-2 h-10 rounded-md cursor-pointer transition-all hover:opacity-90 ${
                          tarea.completada ? 'opacity-70' : ''
                        }`}
                        style={{
                          left: `${offsetDias * anchoColumna}px`,
                          width: `${duracionDias * anchoColumna - 4}px`,
                          backgroundColor: calendarioServiceDB.getColorPrioridad(tarea.prioridad),
                        }}
                        onClick={() => onTareaSeleccionada(tarea)}
                      >
                        <div className="px-2 py-1 text-xs text-white truncate">
                          {tarea.titulo}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-0">
      <Tabs defaultValue="mes" className="h-full flex flex-col">
        <div className="px-5 pt-5 border-b">
          <TabsList className="grid grid-cols-4 mb-4 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="dia" className="rounded-md">Día</TabsTrigger>
            <TabsTrigger value="semana" className="rounded-md">Semana</TabsTrigger>
            <TabsTrigger value="mes" className="rounded-md">Mes</TabsTrigger>
            <TabsTrigger value="gantt" className="rounded-md">
              <GanttChart className="h-4 w-4 mr-1" />
              Gantt
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dia" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0">
          {renderDiaDetalle()}
        </TabsContent>
        
        <TabsContent value="semana" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0">
          {renderSemanaDetalle()}
        </TabsContent>
        
        <TabsContent value="gantt" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0">
          {renderGanttDetalle()}
        </TabsContent>
        
        <TabsContent value="mes" className="flex-1 overflow-y-auto m-0 data-[state=active]:mt-0 p-4">
          <CalendarUI
            mode="single"
            selected={fecha}
            onSelect={(date) => date && onFechaSeleccionada(date)}
            locale={es}
            className="mx-auto w-full max-w-3xl"
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
                "h-12 w-12 p-0 font-normal aria-selected:opacity-100 relative",
                "hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
                "disabled:opacity-50"
              ),
              head_cell: "text-muted-foreground rounded-md font-normal text-[0.9rem] w-12",
              table: "w-full border-collapse space-y-1",
              caption: "flex justify-center pt-2 pb-4 relative items-center",
              caption_label: "text-lg font-medium text-primary",
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
