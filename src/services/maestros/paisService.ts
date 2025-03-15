
import { supabase } from "@/integrations/supabase/client";
import { Pais } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

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
    console.log("Creating país with data:", pais);
    
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
    console.log("Updating país with ID:", id, "and data:", pais);
    
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
