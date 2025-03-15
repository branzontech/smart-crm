
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

// Update Pais to include descripcion and change codigo to number type
export interface Pais {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo?: number;
  created_at: string;
  updated_at: string;
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

// Utility interface for handling Supabase joins
export interface RelationshipResponse<T> {
  data: T | null;
  error: Error | null;
}
