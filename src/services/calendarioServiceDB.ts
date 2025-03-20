
import { supabase } from "@/integrations/supabase/client";
import { CalendarioTarea, UsuarioCalendario } from "@/types/calendario";

export class CalendarioServiceDB {
  // Métodos para obtener y manipular tareas
  async getTareas(): Promise<CalendarioTarea[]> {
    try {
      const { data: tareas, error } = await supabase
        .from('calendario_tareas')
        .select(`
          *,
          calendario_tareas_usuarios(usuario_id)
        `)
        .order('fecha_inicio', { ascending: true });

      if (error) throw error;

      // Transformar los datos a nuestro formato de CalendarioTarea
      return tareas.map(tarea => this.mapDatabaseToTarea(tarea));
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      return [];
    }
  }

  async getTareaById(id: string): Promise<CalendarioTarea | null> {
    try {
      const { data: tarea, error } = await supabase
        .from('calendario_tareas')
        .select(`
          *,
          calendario_tareas_usuarios(usuario_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return this.mapDatabaseToTarea(tarea);
    } catch (error) {
      console.error(`Error al obtener tarea ${id}:`, error);
      return null;
    }
  }

  async crearTarea(tarea: Omit<CalendarioTarea, 'id'>): Promise<CalendarioTarea | null> {
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    try {
      // 1. Insertar la tarea
      const { data: nuevaTarea, error: errorTarea } = await supabase
        .from('calendario_tareas')
        .insert({
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          fecha_inicio: tarea.fechaInicio.toISOString(),
          fecha_fin: tarea.fechaFin ? tarea.fechaFin.toISOString() : null,
          todo_el_dia: tarea.todoElDia,
          completada: tarea.completada,
          prioridad: tarea.prioridad,
          categoria: tarea.categoria,
          creado_por: userId
        })
        .select()
        .single();

      if (errorTarea) throw errorTarea;

      // 2. Asignar usuarios a la tarea
      if (tarea.agentes && tarea.agentes.length > 0) {
        const asignaciones = tarea.agentes.map(agenteId => ({
          tarea_id: nuevaTarea.id,
          usuario_id: agenteId
        }));

        const { error: errorAsignaciones } = await supabase
          .from('calendario_tareas_usuarios')
          .insert(asignaciones);

        if (errorAsignaciones) throw errorAsignaciones;
      }

      // 3. Obtener la tarea completa con sus asignaciones
      return this.getTareaById(nuevaTarea.id);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      return null;
    }
  }

  async actualizarTarea(id: string, datos: Partial<CalendarioTarea>): Promise<CalendarioTarea | null> {
    try {
      // 1. Actualizar la información básica de la tarea
      const { error: errorTarea } = await supabase
        .from('calendario_tareas')
        .update({
          titulo: datos.titulo,
          descripcion: datos.descripcion,
          fecha_inicio: datos.fechaInicio ? datos.fechaInicio.toISOString() : undefined,
          fecha_fin: datos.fechaFin ? datos.fechaFin.toISOString() : null,
          todo_el_dia: datos.todoElDia,
          completada: datos.completada,
          prioridad: datos.prioridad,
          categoria: datos.categoria
        })
        .eq('id', id);

      if (errorTarea) throw errorTarea;

      // 2. Si hay cambios en las asignaciones, actualizar
      if (datos.agentes) {
        // Primero eliminamos todas las asignaciones actuales
        const { error: errorBorrar } = await supabase
          .from('calendario_tareas_usuarios')
          .delete()
          .eq('tarea_id', id);

        if (errorBorrar) throw errorBorrar;

        // Luego creamos las nuevas asignaciones
        if (datos.agentes.length > 0) {
          const asignaciones = datos.agentes.map(agenteId => ({
            tarea_id: id,
            usuario_id: agenteId
          }));

          const { error: errorAsignaciones } = await supabase
            .from('calendario_tareas_usuarios')
            .insert(asignaciones);

          if (errorAsignaciones) throw errorAsignaciones;
        }
      }

      // 3. Retornar la tarea actualizada
      return this.getTareaById(id);
    } catch (error) {
      console.error(`Error al actualizar tarea ${id}:`, error);
      return null;
    }
  }

  async cambiarEstadoTarea(id: string, completada: boolean): Promise<CalendarioTarea | null> {
    try {
      const { error } = await supabase
        .from('calendario_tareas')
        .update({ completada })
        .eq('id', id);

      if (error) throw error;
      return this.getTareaById(id);
    } catch (error) {
      console.error(`Error al cambiar estado de tarea ${id}:`, error);
      return null;
    }
  }

  async eliminarTarea(id: string): Promise<boolean> {
    try {
      // Las asignaciones se eliminarán automáticamente por la restricción ON DELETE CASCADE
      const { error } = await supabase
        .from('calendario_tareas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error al eliminar tarea ${id}:`, error);
      return false;
    }
  }

  // Métodos para obtener usuarios (agentes)
  async getUsuarios(): Promise<UsuarioCalendario[]> {
    try {
      const { data: usuarios, error } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email');

      if (error) throw error;

      // Asignar colores aleatorios consistentes basados en el ID
      return usuarios.map(usuario => ({
        id: usuario.id,
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email,
        color: this.getColorForId(usuario.id)
      }));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  async getUsuarioById(id: string): Promise<UsuarioCalendario | null> {
    try {
      const { data: usuario, error } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: usuario.id,
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email,
        color: this.getColorForId(usuario.id)
      };
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error);
      return null;
    }
  }

  // Transformaciones y utilidades
  private mapDatabaseToTarea(dbTarea: any): CalendarioTarea {
    // Extraer los IDs de usuarios asignados
    const agentesIds = Array.isArray(dbTarea.calendario_tareas_usuarios) 
      ? dbTarea.calendario_tareas_usuarios.map((asignacion: any) => asignacion.usuario_id)
      : [];

    return {
      id: dbTarea.id,
      titulo: dbTarea.titulo,
      descripcion: dbTarea.descripcion,
      fechaInicio: new Date(dbTarea.fecha_inicio),
      fechaFin: dbTarea.fecha_fin ? new Date(dbTarea.fecha_fin) : undefined,
      todoElDia: dbTarea.todo_el_dia,
      completada: dbTarea.completada,
      prioridad: dbTarea.prioridad,
      categoria: dbTarea.categoria,
      agentes: agentesIds,
      creadoPor: dbTarea.creado_por
    };
  }

  // Utilidades para la interfaz de usuario
  getColorCategoria(categoria: CalendarioTarea['categoria']): string {
    const colores = {
      'reunion': '#4A90E2',     // Azul
      'entrega': '#50E3C2',     // Verde agua
      'seguimiento': '#F5A623', // Naranja
      'otro': '#9013FE',        // Morado
    };
    return colores[categoria] || '#9B9B9B'; // Gris por defecto
  }

  getColorPrioridad(prioridad: CalendarioTarea['prioridad']): string {
    const colores = {
      'alta': '#D0021B',    // Rojo
      'media': '#F5A623',   // Naranja
      'baja': '#7ED321',    // Verde
    };
    return colores[prioridad] || '#9B9B9B'; // Gris por defecto
  }

  // Genera un color basado en un ID de manera consistente
  private getColorForId(id: string): string {
    // Utilizamos un hash simple del ID para generar un color
    const hash = Array.from(id).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    
    // Lista de colores predefinidos para asignación consistente
    const colores = [
      '#4A90E2', // Azul
      '#50E3C2', // Verde agua
      '#F5A623', // Naranja
      '#D0021B', // Rojo
      '#9013FE', // Morado
      '#7ED321', // Verde
      '#4A4A4A', // Gris oscuro
      '#BD10E0', // Rosa
      '#8B572A', // Marrón
      '#417505'  // Verde oscuro
    ];
    
    return colores[hash % colores.length];
  }
}

// Exportar una instancia del servicio como singleton
export const calendarioServiceDB = new CalendarioServiceDB();
