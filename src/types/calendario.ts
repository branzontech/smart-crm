
export interface Agente {
  id: string;
  nombre: string;
  email: string;
  color: string;
}

export interface CalendarioTarea {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin?: Date;
  todoElDia: boolean;
  completada: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  agentes: string[]; // IDs de los agentes asignados
  categoria: 'reunion' | 'entrega' | 'seguimiento' | 'otro';
  color?: string;
}
