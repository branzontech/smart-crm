
import { supabase } from "@/integrations/supabase/client";
import { TipoProducto } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

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
