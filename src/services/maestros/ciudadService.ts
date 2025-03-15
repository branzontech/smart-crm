
import { supabase } from "@/integrations/supabase/client";
import { Ciudad } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

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
