
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Get complete recaudo details
export const getRecaudoDetails = async (id: string) => {
  try {
    // Get recaudo data
    const { data: recaudo, error: recaudoError } = await supabase
      .from('recaudos')
      .select(`
        *,
        cliente:cliente_id(id, nombre, apellidos, empresa, telefono, direccion, tipo_persona)
      `)
      .eq('id', id)
      .single();

    if (recaudoError) throw recaudoError;

    // Get articulos
    const { data: articulos, error: articulosError } = await supabase
      .from('articulos_recaudo')
      .select(`
        *,
        proveedor:proveedor_id(id, nombre)
      `)
      .eq('recaudo_id', id);

    if (articulosError) throw articulosError;

    // Get archivos
    const { data: archivos, error: archivosError } = await supabase
      .from('archivos_recaudo')
      .select('*')
      .eq('recaudo_id', id);

    if (archivosError) throw archivosError;
    
    // Get file URLs if there are any archivos
    const archivosWithUrls = [];
    if (archivos && archivos.length > 0) {
      for (const archivo of archivos) {
        const { data } = await supabase.storage
          .from('recaudos')
          .getPublicUrl(archivo.path);
        
        if (data && data.publicUrl) {
          archivosWithUrls.push({
            ...archivo,
            url: data.publicUrl,
            tamano: archivo.tamano
          });
        }
      }
    }

    return { 
      data: {
        ...recaudo,
        articulos: articulos || [],
        archivos: archivosWithUrls || []
      }, 
      error: null 
    };
  } catch (error: any) {
    console.error(`Error fetching recaudo ${id}:`, error);
    return { data: null, error };
  }
};

// Update recaudo status
export const updateRecaudoStatus = async (id: string, newStatus: string) => {
  try {
    const { error } = await supabase
      .from('recaudos')
      .update({ estado: newStatus.toLowerCase() }) // Guardar en minúsculas en la BD
      .eq('id', id);

    if (error) throw error;
    
    toast.success(`Estado del recaudo actualizado correctamente`);
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Error updating recaudo status:`, error);
    toast.error(`Error al actualizar el estado: ${error.message}`);
    return { success: false, error };
  }
};

// Update recaudo notes
export const updateRecaudoNotes = async (id: string, notes: string) => {
  try {
    const { error } = await supabase
      .from('recaudos')
      .update({ notas: notes })
      .eq('id', id);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Error updating recaudo notes:`, error);
    toast.error(`Error al actualizar las notas: ${error.message}`);
    return { success: false, error };
  }
};
