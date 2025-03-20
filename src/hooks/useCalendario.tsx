
import { useState, useEffect } from 'react';
import { CalendarioTarea, CalendarioSubtarea, UsuarioCalendario } from '@/types/calendario';
import { calendarioServiceDB } from '@/services/calendarioServiceDB';
import { useToast } from '@/components/ui/use-toast';

export function useCalendario() {
  const [tareas, setTareas] = useState<CalendarioTarea[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioCalendario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tareaSeleccionada, setTareaSeleccionada] = useState<CalendarioTarea | null>(null);
  const { toast } = useToast();

  // Cargar tareas y usuarios
  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [tareasData, usuariosData] = await Promise.all([
        calendarioServiceDB.getTareas(),
        calendarioServiceDB.getUsuarios()
      ]);
      
      // Normalizar fechas para asegurar que son objetos Date
      const tareasConFechasNormalizadas = tareasData.map(tarea => ({
        ...tarea,
        fechaInicio: new Date(tarea.fechaInicio),
        fechaFin: tarea.fechaFin ? new Date(tarea.fechaFin) : undefined
      }));
      
      // Cargar subtareas para cada tarea
      const tareasConSubtareas = await Promise.all(
        tareasConFechasNormalizadas.map(async (tarea) => {
          const subtareas = await calendarioServiceDB.getSubtareasByTareaId(tarea.id);
          // Normalizar fechas de las subtareas también
          const subtareasNormalizadas = subtareas.map(subtarea => ({
            ...subtarea,
            fechaCumplimiento: subtarea.fechaCumplimiento ? new Date(subtarea.fechaCumplimiento) : undefined
          }));
          return { ...tarea, subtareas: subtareasNormalizadas };
        })
      );
      
      setTareas(tareasConSubtareas);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al cargar datos del calendario:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los datos del calendario.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Recargar subtareas cuando se selecciona una tarea
  useEffect(() => {
    if (tareaSeleccionada) {
      const cargarSubtareas = async () => {
        const subtareas = await calendarioServiceDB.getSubtareasByTareaId(tareaSeleccionada.id);
        // Normalizar fechas de las subtareas
        const subtareasNormalizadas = subtareas.map(subtarea => ({
          ...subtarea,
          fechaCumplimiento: subtarea.fechaCumplimiento ? new Date(subtarea.fechaCumplimiento) : undefined
        }));
        setTareaSeleccionada(prev => prev ? { 
          ...prev, 
          subtareas: subtareasNormalizadas 
        } : null);
      };
      
      cargarSubtareas();
    }
  }, [tareaSeleccionada?.id]);

  // Operaciones CRUD para tareas
  const crearTarea = async (tarea: Omit<CalendarioTarea, 'id'>) => {
    try {
      // Asegurar que las fechas son objetos Date antes de guardar
      const tareaParaGuardar = {
        ...tarea,
        fechaInicio: tarea.fechaInicio instanceof Date ? tarea.fechaInicio : new Date(tarea.fechaInicio),
        fechaFin: tarea.fechaFin instanceof Date ? tarea.fechaFin : (tarea.fechaFin ? new Date(tarea.fechaFin) : undefined)
      };
      
      const nuevaTarea = await calendarioServiceDB.crearTarea(tareaParaGuardar);
      if (nuevaTarea) {
        // Normalizar las fechas de la tarea creada
        const tareaConFechasNormalizadas = {
          ...nuevaTarea,
          fechaInicio: new Date(nuevaTarea.fechaInicio),
          fechaFin: nuevaTarea.fechaFin ? new Date(nuevaTarea.fechaFin) : undefined
        };
        
        // Asegurarse de incluir las subtareas en la tarea creada
        const subtareas = tarea.subtareas || [];
        const subtareasNormalizadas = subtareas.map(subtarea => ({
          ...subtarea,
          fechaCumplimiento: subtarea.fechaCumplimiento ? new Date(subtarea.fechaCumplimiento) : undefined
        }));
        
        const tareaConSubtareas = { ...tareaConFechasNormalizadas, subtareas: subtareasNormalizadas };
        
        setTareas(prev => [...prev, tareaConSubtareas]);
        toast({
          title: "Tarea creada",
          description: "La tarea se ha creado correctamente.",
        });
        return tareaConSubtareas;
      }
      throw new Error('No se pudo crear la tarea');
    } catch (error) {
      console.error('Error al crear tarea:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la tarea.",
      });
      return null;
    }
  };

  const actualizarTarea = async (id: string, datos: Partial<CalendarioTarea>) => {
    try {
      // Normalizar fechas en los datos para actualizar
      const datosNormalizados = {
        ...datos,
        fechaInicio: datos.fechaInicio instanceof Date ? datos.fechaInicio : 
          (datos.fechaInicio ? new Date(datos.fechaInicio) : undefined),
        fechaFin: datos.fechaFin instanceof Date ? datos.fechaFin : 
          (datos.fechaFin ? new Date(datos.fechaFin) : undefined)
      };
      
      const tareaActualizada = await calendarioServiceDB.actualizarTarea(id, datosNormalizados);
      if (tareaActualizada) {
        // Normalizar fechas en la tarea actualizada
        const tareaConFechasNormalizadas = {
          ...tareaActualizada,
          fechaInicio: new Date(tareaActualizada.fechaInicio),
          fechaFin: tareaActualizada.fechaFin ? new Date(tareaActualizada.fechaFin) : undefined
        };
        
        // Asegurarse de preservar las subtareas en la tarea actualizada
        const subtareas = datos.subtareas || 
                         (tareaSeleccionada?.id === id ? tareaSeleccionada.subtareas : []);
        
        const subtareasNormalizadas = subtareas?.map(subtarea => ({
          ...subtarea,
          fechaCumplimiento: subtarea.fechaCumplimiento ? new Date(subtarea.fechaCumplimiento) : undefined
        })) || [];
        
        const tareaConSubtareas = { ...tareaConFechasNormalizadas, subtareas: subtareasNormalizadas };
        
        setTareas(prev => prev.map(t => t.id === id ? tareaConSubtareas : t));
        if (tareaSeleccionada && tareaSeleccionada.id === id) {
          setTareaSeleccionada(tareaConSubtareas);
        }
        toast({
          title: "Tarea actualizada",
          description: "La tarea se ha actualizado correctamente.",
        });
        return tareaConSubtareas;
      }
      throw new Error('No se pudo actualizar la tarea');
    } catch (error) {
      console.error(`Error al actualizar tarea ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la tarea.",
      });
      return null;
    }
  };

  const cambiarEstadoTarea = async (tarea: CalendarioTarea, completada: boolean) => {
    try {
      const tareaActualizada = await calendarioServiceDB.cambiarEstadoTarea(tarea.id, completada);
      if (tareaActualizada) {
        // Normalizar fechas en la tarea actualizada
        const tareaConFechasNormalizadas = {
          ...tareaActualizada,
          fechaInicio: new Date(tareaActualizada.fechaInicio),
          fechaFin: tareaActualizada.fechaFin ? new Date(tareaActualizada.fechaFin) : undefined,
          subtareas: tarea.subtareas // Preservar las subtareas
        };
        
        setTareas(prev => prev.map(t => t.id === tarea.id ? tareaConFechasNormalizadas : t));
        if (tareaSeleccionada && tareaSeleccionada.id === tarea.id) {
          setTareaSeleccionada(tareaConFechasNormalizadas);
        }
        return tareaConFechasNormalizadas;
      }
      throw new Error('No se pudo cambiar el estado de la tarea');
    } catch (error) {
      console.error(`Error al cambiar estado de tarea ${tarea.id}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar el estado de la tarea.",
      });
      return null;
    }
  };

  const eliminarTarea = async (id: string) => {
    try {
      const exito = await calendarioServiceDB.eliminarTarea(id);
      if (exito) {
        setTareas(prev => prev.filter(t => t.id !== id));
        if (tareaSeleccionada && tareaSeleccionada.id === id) {
          setTareaSeleccionada(null);
        }
        toast({
          title: "Tarea eliminada",
          description: "La tarea se ha eliminado correctamente.",
        });
        return true;
      }
      throw new Error('No se pudo eliminar la tarea');
    } catch (error) {
      console.error(`Error al eliminar tarea ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la tarea.",
      });
      return false;
    }
  };

  // Nuevas operaciones para subtareas
  const cambiarEstadoSubtarea = async (subtareaId: string, completada: boolean) => {
    try {
      const subtareaActualizada = await calendarioServiceDB.cambiarEstadoSubtarea(subtareaId, completada);
      if (subtareaActualizada && tareaSeleccionada) {
        // Normalizar la fecha de cumplimiento si existe
        const subtareaConFechaNormalizada = {
          ...subtareaActualizada,
          fechaCumplimiento: subtareaActualizada.fechaCumplimiento ? 
            new Date(subtareaActualizada.fechaCumplimiento) : undefined
        };
        
        // Actualizar la subtarea en la tarea seleccionada
        const subtareasActualizadas = tareaSeleccionada.subtareas?.map(st => 
          st.id === subtareaId ? subtareaConFechaNormalizada : st
        ) || [];
        
        // Actualizar la tarea seleccionada
        const tareaActualizada = { ...tareaSeleccionada, subtareas: subtareasActualizadas };
        setTareaSeleccionada(tareaActualizada);
        
        // Actualizar la tarea en la lista de tareas
        setTareas(prev => prev.map(t => 
          t.id === tareaSeleccionada.id ? tareaActualizada : t
        ));
        
        return subtareaConFechaNormalizada;
      }
      throw new Error('No se pudo cambiar el estado de la subtarea');
    } catch (error) {
      console.error(`Error al cambiar estado de subtarea ${subtareaId}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cambiar el estado de la subtarea.",
      });
      return null;
    }
  };

  // Obtener el nombre completo de un usuario
  const getNombreUsuario = (id: string): string => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return 'Usuario desconocido';
    return `${usuario.nombre} ${usuario.apellido || ''}`.trim();
  };

  // Obtener el color de un usuario
  const getColorUsuario = (id: string): string => {
    const usuario = usuarios.find(u => u.id === id);
    return usuario?.color || '#9B9B9B';
  };

  return {
    tareas,
    usuarios,
    isLoading,
    fechaSeleccionada,
    tareaSeleccionada,
    setFechaSeleccionada,
    setTareaSeleccionada,
    cargarDatos,
    crearTarea,
    actualizarTarea,
    cambiarEstadoTarea,
    eliminarTarea,
    cambiarEstadoSubtarea,
    getNombreUsuario,
    getColorUsuario,
    getColorCategoria: calendarioServiceDB.getColorCategoria,
    getColorPrioridad: calendarioServiceDB.getColorPrioridad
  };
}
