
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleSupabaseError } from "@/utils/supabaseHelpers";

export interface CompanyConfig {
  id?: string;
  razon_social: string;
  nit: string;
  direccion: string;
  telefono: string;
  contacto_principal: string;
  telefono_secundario?: string;
  logo_path?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch company configuration
export const fetchCompanyConfig = async (): Promise<CompanyConfig | null> => {
  try {
    // Query without single() to handle empty result properly
    const { data, error } = await supabase
      .from("config_empresas")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    // Check if we got any results
    if (!data || data.length === 0) {
      console.log("No company configuration found");
      return null;
    }
    
    console.log("Fetched company config with email:", data[0]?.email || 'No email configured');
    return data[0] as CompanyConfig;
  } catch (error) {
    handleSupabaseError(error, "Error al obtener la configuración de la empresa");
    return null;
  }
};

// Save or update company configuration
export const saveCompanyConfig = async (config: CompanyConfig): Promise<CompanyConfig | null> => {
  try {
    console.log("Saving company config with email:", config.email || 'No email provided');
    
    let result;
    
    if (config.id) {
      // Update existing config
      const { data, error } = await supabase
        .from("config_empresas")
        .update({
          razon_social: config.razon_social,
          nit: config.nit,
          direccion: config.direccion,
          telefono: config.telefono,
          contacto_principal: config.contacto_principal,
          telefono_secundario: config.telefono_secundario,
          logo_path: config.logo_path,
          email: config.email
        })
        .eq("id", config.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new config
      const { data, error } = await supabase
        .from("config_empresas")
        .insert({
          razon_social: config.razon_social,
          nit: config.nit,
          direccion: config.direccion,
          telefono: config.telefono,
          contacto_principal: config.contacto_principal,
          telefono_secundario: config.telefono_secundario,
          logo_path: config.logo_path,
          email: config.email
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    console.log("Company config saved successfully with email:", result?.email || 'No email saved');
    toast.success("Configuración guardada correctamente");
    return result as CompanyConfig;
  } catch (error) {
    handleSupabaseError(error, "Error al guardar la configuración de la empresa");
    return null;
  }
};

// Upload company logo to storage
export const uploadCompanyLogo = async (file: File): Promise<string | null> => {
  try {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `logo_${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    const { error: uploadError } = await supabase.storage
      .from('company_logos')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL of the uploaded file
    const { data } = supabase.storage
      .from('company_logos')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    handleSupabaseError(error, "Error al subir el logo de la empresa");
    return null;
  }
};

// Delete company logo from storage
export const deleteCompanyLogo = async (logoPath: string): Promise<boolean> => {
  try {
    // Extract filename from the full URL
    const fileName = logoPath.split('/').pop();
    if (!fileName) return false;
    
    const { error } = await supabase.storage
      .from('company_logos')
      .remove([fileName]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    handleSupabaseError(error, "Error al eliminar el logo de la empresa");
    return false;
  }
};
