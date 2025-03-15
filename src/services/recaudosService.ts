
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface ArticuloRecaudo {
  id?: string;
  proveedor_id: string;
  descripcion: string;
  cantidad: number;
  valor_unitario: number;
  valor_total: number;
  tasa_iva: number;
  valor_iva: number;
}

export interface ArchivoRecaudo {
  id?: string;
  nombre: string;
  tipo: string;
  tamano: number;
  path: string;
  file?: File;
}

export interface RecaudoForm {
  cliente_id: string;
  monto: string | number;
  subtotal: number;
  iva: number;
  total: number;
  metodo_pago: string;
  fecha_pago: string;
  fecha_vencimiento: string;
  estado: string;
  notas: string;
  articulos: ArticuloRecaudo[];
  archivos?: File[];
}

// Get the next recaudo number from the database
export const getNextRecaudoNumber = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('get_next_recaudo_numero');
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching next recaudo number:", error);
    return "R000001"; // Fallback default
  }
};

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
    if (recaudoData.articulos && recaudoData.articulos.length > 0) {
      const articulosToInsert = recaudoData.articulos.map(articulo => ({
        recaudo_id: recaudoId,
        proveedor_id: articulo.proveedor_id,
        descripcion: articulo.descripcion,
        cantidad: articulo.cantidad,
        valor_unitario: articulo.valor_unitario,
        valor_total: articulo.valor_total,
        tasa_iva: articulo.tasa_iva,
        valor_iva: articulo.valor_iva
      }));

      const { error: articulosError } = await supabase
        .from('articulos_recaudo')
        .insert(articulosToInsert);

      if (articulosError) throw articulosError;
    }

    // Upload files if any
    if (recaudoData.archivos && recaudoData.archivos.length > 0) {
      const archivosInserts = [];
      
      for (const file of recaudoData.archivos) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${recaudoId}/${fileName}`;
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('recaudos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        
        // Add to database
        archivosInserts.push({
          recaudo_id: recaudoId,
          nombre: file.name,
          tipo: file.type,
          tamano: file.size,
          path: filePath
        });
      }
      
      // Insert file records
      if (archivosInserts.length > 0) {
        const { error: archivosError } = await supabase
          .from('archivos_recaudo')
          .insert(archivosInserts);

        if (archivosError) throw archivosError;
      }
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
    const { data: archivos } = await supabase
      .from('archivos_recaudo')
      .select('path')
      .eq('recaudo_id', id);

    if (archivos && archivos.length > 0) {
      const paths = archivos.map(archivo => archivo.path);
      const { error: storageError } = await supabase.storage
        .from('recaudos')
        .remove(paths);

      if (storageError) {
        console.warn("Error removing files:", storageError);
        // Continue with deletion, don't throw
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

// Get file URL
export const getRecaudoFileUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage
      .from('recaudos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error getting file URL:", error);
    return null;
  }
};
