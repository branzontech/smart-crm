
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Get file URL from storage
export const getFileUrl = async (bucketName: string, filePath: string): Promise<string | null> => {
  try {
    // Get public URL directly
    const { data } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error(`Error getting file URL from ${bucketName}:`, error);
    return null;
  }
};

// Upload a file to storage and return file metadata
export const uploadFile = async (bucketName: string, file: File, folder?: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;
  
  // Upload file to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) throw uploadError;
  
  return {
    nombre: file.name,
    tipo: file.type,
    tamano: file.size,
    path: filePath
  };
};

// Delete files from storage
export const deleteFiles = async (bucketName: string, paths: string[]) => {
  if (paths && paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove(paths);

    if (storageError) {
      console.warn(`Error removing files from ${bucketName}:`, storageError);
      return false;
    }
    return true;
  }
  return true;
};
