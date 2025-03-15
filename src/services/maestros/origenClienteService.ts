
import { supabase } from "@/integrations/supabase/client";
import { OrigenCliente } from "@/types/maestros";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

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
