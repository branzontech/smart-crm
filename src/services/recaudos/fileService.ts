
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Get file URL
export const getRecaudoFileUrl = async (filePath: string): Promise<string | null> => {
  try {
    // Get public URL directly - no need to call download
    const { data } = await supabase.storage
      .from('recaudos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error getting file URL:", error);
    return null;
  }
};

// Upload a file to storage and return file metadata
export const uploadRecaudoFile = async (recaudoId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${recaudoId}/${fileName}`;
  
  // Upload file to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('recaudos')
    .upload(filePath, file);

  if (uploadError) throw uploadError;
  
  return {
    recaudo_id: recaudoId,
    nombre: file.name,
    tipo: file.type,
    tamano: file.size,
    path: filePath
  };
};

// Delete files from storage
export const deleteRecaudoFiles = async (paths: string[]) => {
  if (paths && paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('recaudos')
      .remove(paths);

    if (storageError) {
      console.warn("Error removing files:", storageError);
      return false;
    }
    return true;
  }
  return true;
};

