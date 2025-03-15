import { supabase } from "@/integrations/supabase/client";
import { Sector, TipoServicio, Pais, Ciudad, OrigenCliente, TipoProducto } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

// Sectores
export const fetchSectores = async (): Promise<Sector[]> => {
  try {
    const { data, error } = await supabase
      .from("sectores")
      .select("*")
      .order("nombre");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener sectores");
    return [];
  }
};

export const createSector = async (sector: Omit<Sector, "id" | "created_at" | "updated_at">): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from("sectores")
      .insert(sector)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al crear sector");
    throw error;
  }
};

export const updateSector = async (id: string, sector: Partial<Omit<Sector, "id" | "created_at" | "updated_at">>): Promise<Sector> => {
  try {
    const { data, error } = await supabase
      .from("sectores")
      .update(sector)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar sector");
    throw error;
  }
};

export const deleteSector = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("sectores")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar sector");
    throw error;
  }
};

// Tipos de Servicios
export const fetchTiposServicios = async (): Promise<TipoServicio[]> => {
  try {
    const { data, error } = await supabase
      .from("tipos_servicios")
      .select("*")
      .order("nombre");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener tipos de servicios");
    return [];
  }
};

export const createTipoServicio = async (tipoServicio: Omit<TipoServicio, "id" | "created_at" | "updated_at">): Promise<TipoServicio> => {
  try {
    const { data, error } = await supabase
      .from("tipos_servicios")
      .insert(tipoServicio)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al crear tipo de servicio");
    throw error;
  }
};

export const updateTipoServicio = async (id: string, tipoServicio: Partial<Omit<TipoServicio, "id" | "created_at" | "updated_at">>): Promise<TipoServicio> => {
  try {
    const { data, error } = await supabase
      .from("tipos_servicios")
      .update(tipoServicio)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar tipo de servicio");
    throw error;
  }
};

export const deleteTipoServicio = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("tipos_servicios")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar tipo de servicio");
    throw error;
  }
};

// Países
export const fetchPaises = async (): Promise<Pais[]> => {
  try {
    const { data, error } = await supabase
      .from("paises")
      .select("*")
      .order("nombre");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener países");
    return [];
  }
};

export const createPais = async (pais: Omit<Pais, "id" | "created_at" | "updated_at" | "codigo">): Promise<Pais> => {
  try {
    console.log("Creating país with data:", pais); // For debugging
    
    const { data, error } = await supabase
      .from("paises")
      .insert(pais)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error creating país:", error);
      throw error;
    }
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al crear país");
    throw error;
  }
};

export const updatePais = async (id: string, pais: Partial<Omit<Pais, "id" | "created_at" | "updated_at" | "codigo">>): Promise<Pais> => {
  try {
    console.log("Updating país with ID:", id, "and data:", pais); // For debugging
    
    const { data, error } = await supabase
      .from("paises")
      .update(pais)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Supabase error updating país:", error);
      throw error;
    }
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar país");
    throw error;
  }
};

export const deletePais = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("paises")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar país");
    throw error;
  }
};

// Ciudades
export const fetchCiudades = async (): Promise<Ciudad[]> => {
  try {
    const { data, error } = await supabase
      .from("ciudades")
      .select("*, pais:pais_id(id, nombre)")
      .order("nombre");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener ciudades");
    return [];
  }
};

export const createCiudad = async (ciudad: Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">): Promise<Ciudad> => {
  try {
    const { data, error } = await supabase
      .from("ciudades")
      .insert(ciudad)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al crear ciudad");
    throw error;
  }
};

export const updateCiudad = async (id: string, ciudad: Partial<Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">>): Promise<Ciudad> => {
  try {
    const { data, error } = await supabase
      .from("ciudades")
      .update(ciudad)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar ciudad");
    throw error;
  }
};

export const deleteCiudad = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("ciudades")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar ciudad");
    throw error;
  }
};

// Orígenes de Clientes
export const fetchOrigenesCliente = async (): Promise<OrigenCliente[]> => {
  try {
    const { data, error } = await supabase
      .from("origenes_cliente")
      .select("*")
      .order("nombre");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener orígenes de clientes");
    return [];
  }
};

export const createOrigenCliente = async (origenCliente: Omit<OrigenCliente, "id" | "created_at" | "updated_at">): Promise<OrigenCliente> => {
  try {
    const { data, error } = await supabase
      .from("origenes_cliente")
      .insert(origenCliente)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al crear origen de cliente");
    throw error;
  }
};

export const updateOrigenCliente = async (id: string, origenCliente: Partial<Omit<OrigenCliente, "id" | "created_at" | "updated_at">>): Promise<OrigenCliente> => {
  try {
    const { data, error } = await supabase
      .from("origenes_cliente")
      .update(origenCliente)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar origen de cliente");
    throw error;
  }
};

export const deleteOrigenCliente = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("origenes_cliente")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar origen de cliente");
    throw error;
  }
};

// Tipos de Productos
export const fetchTiposProductos = async (): Promise<TipoProducto[]> => {
  try {
    const { data, error } = await supabase
      .from("tipos_productos")
      .select("*")
      .order("nombre");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener tipos de productos");
    return [];
  }
};

export const createTipoProducto = async (tipoProducto: Omit<TipoProducto, "id" | "created_at" | "updated_at">): Promise<TipoProducto> => {
  try {
    const { data, error } = await supabase
      .from("tipos_productos")
      .insert(tipoProducto)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al crear tipo de producto");
    throw error;
  }
};

export const updateTipoProducto = async (id: string, tipoProducto: Partial<Omit<TipoProducto, "id" | "created_at" | "updated_at">>): Promise<TipoProducto> => {
  try {
    const { data, error } = await supabase
      .from("tipos_productos")
      .update(tipoProducto)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar tipo de producto");
    throw error;
  }
};

export const deleteTipoProducto = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("tipos_productos")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar tipo de producto");
    throw error;
  }
};
