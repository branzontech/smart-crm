
export interface Clausula {
  id: string;
  titulo: string;
  tipo: string;
  contenido: string;
  editable: boolean;
  requerido?: boolean;
}

export interface Contrato {
  id?: string;
  titulo: string;
  clausulas: Clausula[];
  fechaCreacion?: Date;
  estado?: 'borrador' | 'pendiente_firma' | 'firmado';
  contratante?: {
    nombre: string;
    identificacion: string;
    cargo?: string;
  };
  contratista?: {
    nombre: string;
    identificacion: string;
  };
}
