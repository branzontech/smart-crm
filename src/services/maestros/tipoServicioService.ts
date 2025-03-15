
import { supabase } from "@/integrations/supabase/client";
import { TipoServicio } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

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
