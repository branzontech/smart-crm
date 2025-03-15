
import { supabase } from "@/integrations/supabase/client";
import { uploadRecaudoFile } from "./fileService";

// Insert archivos
export const insertArchivosRecaudo = async (recaudoId: string, files: File[]) => {
  if (!files || files.length === 0) return { error: null };
  
  const archivosInserts = [];
  
  for (const file of files) {
    try {
      const fileData = await uploadRecaudoFile(recaudoId, file);
      archivosInserts.push(fileData);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
  
  // Insert file records
  if (archivosInserts.length > 0) {
    return await supabase
      .from('archivos_recaudo')
      .insert(archivosInserts);
  }
  
  return { error: null };
};

// Get archivos for a recaudo
export const getArchivosRecaudo = async (recaudoId: string) => {
  return await supabase
    .from('archivos_recaudo')
    .select('*')
    .eq('recaudo_id', recaudoId);
};

// Get file paths for deletion
export const getArchivosPaths = async (recaudoId: string) => {
  const { data } = await supabase
    .from('archivos_recaudo')
    .select('path')
    .eq('recaudo_id', recaudoId);
    
  return data ? data.map(archivo => archivo.path) : [];
};
