import { supabase } from "@/integrations/supabase/client";
import { CalendarioTarea, CalendarioSubtarea, UsuarioCalendario } from "@/types/calendario";

export class CalendarioServiceDB {
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

      if (tarea.subtareas && tarea.subtareas.length > 0) {
        const subtareas = tarea.subtareas.map(subtarea => ({
          tarea_id: nuevaTarea.id,
          titulo: subtarea.titulo,
          descripcion: subtarea.descripcion,
          fecha_cumplimiento: subtarea.fechaCumplimiento ? subtarea.fechaCumplimiento.toISOString() : null,
          completada: subtarea.completada
        }));

        const { error: errorSubtareas } = await supabase
          .from('calendario_subtareas')
          .insert(subtareas);

        if (errorSubtareas) throw errorSubtareas;
      }

      return this.getTareaById(nuevaTarea.id);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      return null;
    }
  }

  async actualizarTarea(id: string, datos: Partial<CalendarioTarea>): Promise<CalendarioTarea | null> {
    try {
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

      if (datos.agentes) {
        const { error: errorBorrar } = await supabase
          .from('calendario_tareas_usuarios')
          .delete()
          .eq('tarea_id', id);

        if (errorBorrar) throw errorBorrar;

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

      if (datos.subtareas) {
        const { error: errorBorrarSub } = await supabase
          .from('calendario_subtareas')
          .delete()
          .eq('tarea_id', id);

        if (errorBorrarSub) throw errorBorrarSub;

        if (datos.subtareas.length > 0) {
          const subtareas = datos.subtareas.map(subtarea => ({
            tarea_id: id,
            titulo: subtarea.titulo,
            descripcion: subtarea.descripcion,
            fecha_cumplimiento: subtarea.fechaCumplimiento ? subtarea.fechaCumplimiento.toISOString() : null,
            completada: subtarea.completada
          }));

          const { error: errorSubtareas } = await supabase
            .from('calendario_subtareas')
            .insert(subtareas);

          if (errorSubtareas) throw errorSubtareas;
        }
      }

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

  async getSubtareasByTareaId(tareaId: string): Promise<CalendarioSubtarea[]> {
    try {
      const { data: subtareas, error } = await supabase
        .from('calendario_subtareas')
        .select('*')
        .eq('tarea_id', tareaId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return subtareas.map(subtarea => this.mapDatabaseToSubtarea(subtarea));
    } catch (error) {
      console.error(`Error al obtener subtareas de la tarea ${tareaId}:`, error);
      return [];
    }
  }

  async cambiarEstadoSubtarea(id: string, completada: boolean): Promise<CalendarioSubtarea | null> {
    try {
      const { data: subtarea, error } = await supabase
        .from('calendario_subtareas')
        .update({ completada })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToSubtarea(subtarea);
    } catch (error) {
      console.error(`Error al cambiar estado de subtarea ${id}:`, error);
      return null;
    }
  }

  async getUsuarios(): Promise<UsuarioCalendario[]> {
    try {
      const { data: usuarios, error } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email');

      if (error) throw error;

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

  private mapDatabaseToTarea(dbTarea: any): CalendarioTarea {
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

  private mapDatabaseToSubtarea(dbSubtarea: any): CalendarioSubtarea {
    return {
      id: dbSubtarea.id,
      tareaId: dbSubtarea.tarea_id,
      titulo: dbSubtarea.titulo,
      descripcion: dbSubtarea.descripcion,
      fechaCumplimiento: dbSubtarea.fecha_cumplimiento ? new Date(dbSubtarea.fecha_cumplimiento) : undefined,
      completada: dbSubtarea.completada
    };
  }

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

  private getColorForId(id: string): string {
    const hash = Array.from(id).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    
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

export const calendarioServiceDB = new CalendarioServiceDB();
