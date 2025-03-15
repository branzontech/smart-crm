
import { supabase } from "@/integrations/supabase/client";
import { uploadRecaudoFile, getRecaudoFileUrl } from "./fileService";

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

// Get archivos for a recaudo with their public URLs
export const getArchivosRecaudo = async (recaudoId: string) => {
  const { data, error } = await supabase
    .from('archivos_recaudo')
    .select('*')
    .eq('recaudo_id', recaudoId);
    
  if (error) return { data: null, error };
  
  // Get public URLs for each file
  if (data && data.length > 0) {
    const archivosWithUrls = await Promise.all(
      data.map(async (archivo) => {
        const publicUrl = await getRecaudoFileUrl(archivo.path);
        return {
          ...archivo,
          url: publicUrl
        };
      })
    );
    
    return { data: archivosWithUrls, error: null };
  }
  
  return { data, error };
};

// Get file paths for deletion
export const getArchivosPaths = async (recaudoId: string) => {
  const { data } = await supabase
    .from('archivos_recaudo')
    .select('path')
    .eq('recaudo_id', recaudoId);
    
  return data ? data.map(archivo => archivo.path) : [];
};
