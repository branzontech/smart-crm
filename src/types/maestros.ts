
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

// Nueva interfaz para tipos de productos
export interface TipoProducto extends MaestroBase {}

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

// Define Cliente interface
export interface Cliente {
  id: string;
  tipo_persona: "natural" | "juridica";
  tipo_documento: string;
  documento: string;
  nombre: string;
  apellidos?: string;
  empresa?: string;
  cargo?: string;
  email: string;
  telefono: string;
  tipo: "potencial" | "activo" | "inactivo" | "recurrente" | "referido" | "suspendido" | "corporativo";
  tipo_servicio_id: string;
  tipo_servicio?: {
    id: string;
    nombre: string;
  };
  sector_id: string;
  sector?: {
    id: string;
    nombre: string;
  };
  direccion: string;
  ciudad_id: string;
  ciudad?: {
    id: string;
    nombre: string;
    pais?: {
      id: string;
      nombre: string;
    };
  };
  pais_id: string;
  pais?: {
    id: string;
    nombre: string;
  };
  notas?: string;
  origen_id: string;
  origen?: {
    id: string;
    nombre: string;
  };
  presupuesto_estimado?: number;
  created_at: string;
  updated_at: string;
}

// Utility interface for handling Supabase joins
export interface RelationshipResponse<T> {
  data: T | null;
  error: Error | null;
}
