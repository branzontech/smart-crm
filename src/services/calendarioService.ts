
import { v4 as uuidv4 } from "uuid";
import { CalendarioTarea, Agente } from "@/types/calendario";

// Datos de ejemplo de agentes
const AGENTES_MOCK: Agente[] = [
  { id: 'a1', nombre: 'Ana Rivera', email: 'ana@example.com', color: '#4A90E2' },
  { id: 'a2', nombre: 'Carlos Martínez', email: 'carlos@example.com', color: '#50E3C2' },
  { id: 'a3', nombre: 'Laura Gómez', email: 'laura@example.com', color: '#F5A623' },
  { id: 'a4', nombre: 'Javier López', email: 'javier@example.com', color: '#D0021B' },
];

// Datos de ejemplo de tareas
const TAREAS_MOCK: CalendarioTarea[] = [
  {
    id: 't1',
    titulo: 'Reunión con Tech Solutions',
    descripcion: 'Discutir propuesta técnica para nuevo proyecto',
    fechaInicio: new Date(2024, 2, 15, 10, 0),
    fechaFin: new Date(2024, 2, 15, 11, 30),
    todoElDia: false,
    completada: false,
    prioridad: 'alta',
    agentes: ['a1', 'a2'],
    categoria: 'reunion',
  },
  {
    id: 't2',
    titulo: 'Presentación Green Energy',
    descripcion: 'Presentación de informe semestral',
    fechaInicio: new Date(2024, 2, 20, 14, 0),
    fechaFin: new Date(2024, 2, 20, 16, 0),
    todoElDia: false,
    completada: false,
    prioridad: 'media',
    agentes: ['a1', 'a3'],
    categoria: 'entrega', // Cambiado de "presentacion" a "entrega" para que coincida con los tipos permitidos
  },
  {
    id: 't3',
    titulo: 'Seguimiento Global Logistics',
    descripcion: 'Llamada de seguimiento sobre implementación',
    fechaInicio: new Date(2024, 2, 25, 9, 0),
    fechaFin: new Date(2024, 2, 25, 10, 0),
    todoElDia: false,
    completada: true,
    prioridad: 'baja',
    agentes: ['a4'],
    categoria: 'seguimiento',
  },
];

// Clase para gestionar tareas del calendario (Principio de responsabilidad única)
class CalendarioService {
  private tareas: CalendarioTarea[] = TAREAS_MOCK;
  private agentes: Agente[] = AGENTES_MOCK;

  // Métodos para tareas
  getTareas(): CalendarioTarea[] {
    return this.tareas;
  }

  getTareaById(id: string): CalendarioTarea | undefined {
    return this.tareas.find(tarea => tarea.id === id);
  }

  getTareasPorFecha(fecha: Date): CalendarioTarea[] {
    return this.tareas.filter(tarea => {
      const tareaFecha = new Date(tarea.fechaInicio);
      return tareaFecha.getDate() === fecha.getDate() &&
             tareaFecha.getMonth() === fecha.getMonth() &&
             tareaFecha.getFullYear() === fecha.getFullYear();
    });
  }

  getTareasPorAgente(agenteId: string): CalendarioTarea[] {
    return this.tareas.filter(tarea => tarea.agentes.includes(agenteId));
  }

  crearTarea(tarea: Omit<CalendarioTarea, 'id'>): CalendarioTarea {
    const nuevaTarea: CalendarioTarea = {
      ...tarea,
      id: `t-${uuidv4().slice(0, 8)}`,
    };
    this.tareas.push(nuevaTarea);
    return nuevaTarea;
  }

  actualizarTarea(id: string, datos: Partial<CalendarioTarea>): CalendarioTarea | undefined {
    const index = this.tareas.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tareas[index] = { ...this.tareas[index], ...datos };
      return this.tareas[index];
    }
    return undefined;
  }

  cambiarEstadoTarea(id: string, completada: boolean): CalendarioTarea | undefined {
    return this.actualizarTarea(id, { completada });
  }

  eliminarTarea(id: string): boolean {
    const longitud = this.tareas.length;
    this.tareas = this.tareas.filter(t => t.id !== id);
    return longitud > this.tareas.length;
  }

  // Métodos para agentes
  getAgentes(): Agente[] {
    return this.agentes;
  }

  getAgenteById(id: string): Agente | undefined {
    return this.agentes.find(agente => agente.id === id);
  }

  crearAgente(agente: Omit<Agente, 'id'>): Agente {
    const nuevoAgente: Agente = {
      ...agente,
      id: `a-${uuidv4().slice(0, 8)}`,
    };
    this.agentes.push(nuevoAgente);
    return nuevoAgente;
  }

  actualizarAgente(id: string, datos: Partial<Agente>): Agente | undefined {
    const index = this.agentes.findIndex(a => a.id === id);
    if (index !== -1) {
      this.agentes[index] = { ...this.agentes[index], ...datos };
      return this.agentes[index];
    }
    return undefined;
  }

  eliminarAgente(id: string): boolean {
    const longitud = this.agentes.length;
    this.agentes = this.agentes.filter(a => a.id !== id);
    
    // También eliminamos al agente de las tareas asociadas
    this.tareas = this.tareas.map(tarea => ({
      ...tarea,
      agentes: tarea.agentes.filter(agenteId => agenteId !== id)
    }));
    
    return longitud > this.agentes.length;
  }

  // Utilidades
  getColorCategoria(categoria: CalendarioTarea['categoria']): string {
    const colores = {
      'reunion': '#4A90E2',       // Azul
      'entrega': '#50E3C2',       // Verde agua
      'seguimiento': '#F5A623',   // Naranja
      'otro': '#9013FE',          // Morado
    };
    return colores[categoria] || '#9B9B9B'; // Gris por defecto
  }

  getColorPrioridad(prioridad: CalendarioTarea['prioridad']): string {
    const colores = {
      'alta': '#D0021B',      // Rojo
      'media': '#F5A623',     // Naranja
      'baja': '#7ED321',      // Verde
    };
    return colores[prioridad] || '#9B9B9B'; // Gris por defecto
  }
}

// Exportamos una instancia del servicio como singleton
export const calendarioService = new CalendarioService();
