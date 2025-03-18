
import { supabase } from "@/integrations/supabase/client";
import { handleSupabaseError } from "@/utils/supabaseHelpers";
import { toast } from "sonner";

export interface Oportunidad {
  id: string;
  cliente: string;
  valor: number;
  etapa: string;
  probabilidad: number;
  fecha_cierre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export const createOportunidad = async (oportunidad: Omit<Oportunidad, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .insert(oportunidad)
      .select('id')
      .single();

    if (error) {
      handleSupabaseError(error, "Error al crear la oportunidad");
      return null;
    }

    return data.id;
  } catch (error) {
    handleSupabaseError(error, "Error al crear la oportunidad");
    return null;
  }
};

export const getOportunidades = async (): Promise<Oportunidad[]> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, "Error al obtener las oportunidades");
      return [];
    }

    return data || [];
  } catch (error) {
    handleSupabaseError(error, "Error al obtener las oportunidades");
    return [];
  }
};

export const getOportunidadById = async (id: string): Promise<Oportunidad | null> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      handleSupabaseError(error, "Error al obtener la oportunidad");
      return null;
    }

    return data;
  } catch (error) {
    handleSupabaseError(error, "Error al obtener la oportunidad");
    return null;
  }
};

export const updateOportunidad = async (id: string, oportunidad: Partial<Oportunidad>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('oportunidades')
      .update(oportunidad)
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, "Error al actualizar la oportunidad");
      return false;
    }

    return true;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar la oportunidad");
    return false;
  }
};

export const deleteOportunidad = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('oportunidades')
      .delete()
      .eq('id', id);

    if (error) {
      handleSupabaseError(error, "Error al eliminar la oportunidad");
      return false;
    }

    return true;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar la oportunidad");
    return false;
  }
};
