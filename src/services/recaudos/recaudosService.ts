
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RecaudoForm } from "./types";
import { insertArticulosRecaudo, getArticulosRecaudo } from "./articulosService";
import { insertArchivosRecaudo, getArchivosRecaudo, getArchivosPaths } from "./archivosService";
import { deleteRecaudoFiles } from "./fileService";

// Create a new recaudo with transaction support
export const createRecaudo = async (recaudoData: RecaudoForm): Promise<{ data: any | null; error: Error | null }> => {
  try {
    // Start a transaction
    const { data: recaudoId, error: recaudoError } = await supabase.rpc('crear_recaudo', {
      p_cliente_id: recaudoData.cliente_id,
      p_monto: typeof recaudoData.monto === 'string' ? parseFloat(recaudoData.monto) : recaudoData.monto,
      p_subtotal: recaudoData.subtotal,
      p_iva: recaudoData.iva,
      p_total: recaudoData.total,
      p_metodo_pago: recaudoData.metodo_pago,
      p_fecha_pago: recaudoData.fecha_pago,
      p_fecha_vencimiento: recaudoData.fecha_vencimiento,
      p_estado: recaudoData.estado,
      p_notas: recaudoData.notas || null
    });

    if (recaudoError) throw recaudoError;
    
    if (!recaudoId) {
      throw new Error("Failed to create recaudo record");
    }

    // Insert articulos
    const { error: articulosError } = await insertArticulosRecaudo(recaudoId, recaudoData.articulos);
    if (articulosError) throw articulosError;

    // Upload files and insert records if any
    if (recaudoData.archivos && recaudoData.archivos.length > 0) {
      const { error: archivosError } = await insertArchivosRecaudo(recaudoId, recaudoData.archivos);
      if (archivosError) throw archivosError;
    }

    return { data: recaudoId, error: null };
  } catch (error: any) {
    console.error("Error creating recaudo:", error);
    toast.error(`Error al crear recaudo: ${error.message}`);
    return { data: null, error };
  }
};

// Get all recaudos
export const getRecaudos = async (): Promise<{ data: any[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('recaudos')
      .select(`
        *,
        cliente:cliente_id(id, nombre, apellidos, empresa)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error fetching recaudos:", error);
    return { data: null, error };
  }
};

// Get recaudo by id
export const getRecaudoById = async (id: string): Promise<{ data: any | null; error: Error | null }> => {
  try {
    const { data: recaudo, error: recaudoError } = await supabase
      .from('recaudos')
      .select(`
        *,
        cliente:cliente_id(id, nombre, apellidos, empresa)
      `)
      .eq('id', id)
      .single();

    if (recaudoError) throw recaudoError;

    // Get articulos
    const { data: articulos, error: articulosError } = await getArticulosRecaudo(id);
    if (articulosError) throw articulosError;

    // Get archivos
    const { data: archivos, error: archivosError } = await getArchivosRecaudo(id);
    if (archivosError) throw archivosError;

    return { 
      data: {
        ...recaudo,
        articulos: articulos || [],
        archivos: archivos || []
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error(`Error fetching recaudo ${id}:`, error);
    return { data: null, error };
  }
};

// Delete recaudo
export const deleteRecaudo = async (id: string): Promise<{ error: Error | null }> => {
  try {
    // Delete files from storage first
    const paths = await getArchivosPaths(id);
    if (paths.length > 0) {
      const success = await deleteRecaudoFiles(paths);
      if (!success) {
        console.warn("Some files couldn't be removed from storage");
      }
    }

    // The database cascade will handle the articulos and archivos records
    const { error } = await supabase
      .from('recaudos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error(`Error deleting recaudo ${id}:`, error);
    toast.error(`Error al eliminar recaudo: ${error.message}`);
    return { error };
  }
};
