
import { useState, useEffect } from 'react';
import { CalendarioTarea, UsuarioCalendario } from '@/types/calendario';
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
      setTareas(tareasData);
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

  // Operaciones CRUD para tareas
  const crearTarea = async (tarea: Omit<CalendarioTarea, 'id'>) => {
    try {
      const nuevaTarea = await calendarioServiceDB.crearTarea(tarea);
      if (nuevaTarea) {
        setTareas(prev => [...prev, nuevaTarea]);
        toast({
          title: "Tarea creada",
          description: "La tarea se ha creado correctamente.",
        });
        return nuevaTarea;
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
      const tareaActualizada = await calendarioServiceDB.actualizarTarea(id, datos);
      if (tareaActualizada) {
        setTareas(prev => prev.map(t => t.id === id ? tareaActualizada : t));
        if (tareaSeleccionada && tareaSeleccionada.id === id) {
          setTareaSeleccionada(tareaActualizada);
        }
        toast({
          title: "Tarea actualizada",
          description: "La tarea se ha actualizado correctamente.",
        });
        return tareaActualizada;
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
        setTareas(prev => prev.map(t => t.id === tarea.id ? tareaActualizada : t));
        if (tareaSeleccionada && tareaSeleccionada.id === tarea.id) {
          setTareaSeleccionada(tareaActualizada);
        }
        return tareaActualizada;
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
    getNombreUsuario,
    getColorUsuario,
    getColorCategoria: calendarioServiceDB.getColorCategoria,
    getColorPrioridad: calendarioServiceDB.getColorPrioridad
  };
}
