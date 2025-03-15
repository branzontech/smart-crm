
import { supabase } from "@/integrations/supabase/client";
import { Sector } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

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
