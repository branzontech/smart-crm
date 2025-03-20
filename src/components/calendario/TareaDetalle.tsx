
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
  ListTodo,
  MessageSquare,
  CheckSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SubtareasList } from "./SubtareasList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("detalles");
  
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

  // Definir colores para prioridades en estilo Asana
  const getPrioridadColor = (prioridad: string) => {
    switch(prioridad) {
      case 'alta': return '#f06a6a'; // rojo para alta prioridad
      case 'media': return '#e5a43b'; // naranja para media prioridad
      case 'baja': return '#4573d2'; // azul para baja prioridad
      default: return '#6c7589'; // gris para sin prioridad
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 pb-3 border-b">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-semibold text-gray-800">{tarea.titulo}</h3>
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
          <p className="text-gray-600 mb-3 text-sm">{tarea.descripcion}</p>
        )}
      </div>

      <Tabs defaultValue="detalles" className="w-full flex-1 overflow-hidden flex flex-col" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="px-5 pt-2 border-b flex w-full justify-start space-x-4 bg-transparent h-auto">
          <TabsTrigger 
            value="detalles" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 border-b-2 border-transparent rounded-none bg-transparent px-1 py-2 text-sm font-medium"
          >
            Detalles
          </TabsTrigger>
          <TabsTrigger 
            value="subtareas" 
            className="flex items-center gap-1 data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-700 border-b-2 border-transparent rounded-none bg-transparent px-1 py-2 text-sm font-medium"
          >
            <CheckSquare className="h-4 w-4" />
            Subtareas
            {subtareas.length > 0 && (
              <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                {subtareasCompletadas}/{subtareas.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalles" className="p-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-purple-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Fecha</div>
                    <div className="text-sm">
                      {formatoFecha(tarea.fechaInicio)}
                      {tarea.fechaFin && tarea.fechaInicio.toDateString() !== tarea.fechaFin.toDateString() && (
                        <> - {formatoFecha(tarea.fechaFin)}</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-purple-500" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-500">Hora</div>
                    <div className="text-sm">
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
                <Tag className="h-5 w-5 mr-3 text-purple-500 mt-1" />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Detalles</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant="outline" 
                      className="py-1 px-3 rounded-full"
                      style={{ 
                        color: calendarioServiceDB.getColorCategoria(tarea.categoria),
                        borderColor: 'transparent',
                        backgroundColor: `${calendarioServiceDB.getColorCategoria(tarea.categoria)}20`
                      }}
                    >
                      <span className="capitalize">{tarea.categoria}</span>
                    </Badge>
                    
                    <Badge 
                      variant="outline"
                      className="py-1 px-3 rounded-full"
                      style={{ 
                        color: getPrioridadColor(tarea.prioridad),
                        borderColor: 'transparent',
                        backgroundColor: `${getPrioridadColor(tarea.prioridad)}20`
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
                <Users className="h-5 w-5 mr-3 text-purple-500 mt-1" />
                <div className="space-y-3 w-full">
                  <div className="text-sm font-medium text-gray-500">Usuarios asignados ({tarea.agentes.length})</div>
                  
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
        </TabsContent>
        
        <TabsContent value="subtareas" className="p-5 overflow-y-auto flex-1">
          {subtareas.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Progreso: {subtareasCompletadas} de {subtareas.length} completadas
                </span>
                <span className="text-sm font-medium">{progresoSubtareas}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-purple-500"
                  style={{ width: `${progresoSubtareas}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-base font-medium mb-3 text-gray-700">Lista de subtareas</h3>
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
        </TabsContent>
      </Tabs>

      <div className="mt-auto px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3 border-t">
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
          className="bg-purple-600 hover:bg-purple-700 gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </div>
    </div>
  );
};
