
export interface MaestroBase {
  id: string;
  nombre: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export interface Sector extends MaestroBase {}

export interface TipoServicio extends MaestroBase {}

export interface OrigenCliente extends MaestroBase {}

export interface Pais extends MaestroBase {
  codigo?: string;
}

export interface Ciudad {
  id: string;
  nombre: string;
  pais_id: string;
  pais?: {
    id: string;
    nombre: string;
  };
  created_at: string;
  updated_at: string;
}
