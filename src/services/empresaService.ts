
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Empresa {
  id: string;
  nombre: string;
  industria: string;
  industria_nombre?: string;
  empleados: number;
  ciudad: string;
  ciudad_nombre?: string;
  direccion: string;
  telefono: string;
  sitio_web?: string;
  descripcion?: string;
  periodo_vencimiento_facturas: string;
  created_at: string;
  updated_at: string;
}

export const createEmpresa = async (empresa: Omit<Empresa, "id" | "created_at" | "updated_at">): Promise<Empresa> => {
  try {
    // Asegurarse de que los campos requeridos estén presentes
    if (!empresa.nombre) {
      throw new Error("El nombre de la empresa es requerido");
    }

    // Use type assertion to work around type limitations
    const { data, error } = await supabase
      .from("empresas" as any)
      .insert(empresa)
      .select()
      .single();
    
    if (error) {
      console.error("Error al crear empresa:", error);
      throw error;
    }
    
    // Ensure proper type conversion
    return data as unknown as Empresa;
  } catch (error: any) {
    toast.error(`Error al crear empresa: ${error.message}`);
    throw error;
  }
};

export const fetchEmpresas = async (): Promise<Empresa[]> => {
  try {
    // Use type assertion to work around type limitations
    const { data, error } = await supabase
      .from("empresas" as any)
      .select(`
        *
      `)
      .order("nombre");
    
    if (error) throw error;
    
    // Get the raw data first, then we'll fetch related data separately
    const empresas = data as any[];
    
    // Process each empresa to fetch related data
    const empresasFormateadas = await Promise.all(empresas.map(async (empresa) => {
      // Fetch industria name
      const { data: industriaData, error: industriaError } = await supabase
        .from("sectores" as any)
        .select("nombre")
        .eq("id", empresa.industria)
        .single();
      
      // Fetch ciudad name
      const { data: ciudadData, error: ciudadError } = await supabase
        .from("ciudades" as any)
        .select("nombre")
        .eq("id", empresa.ciudad)
        .single();
      
      return {
        ...empresa,
        industria_nombre: industriaError ? 'No disponible' : industriaData?.nombre || 'No disponible',
        ciudad_nombre: ciudadError ? 'No disponible' : ciudadData?.nombre || 'No disponible'
      };
    }));
    
    // Ensure proper type conversion
    return empresasFormateadas as unknown as Empresa[];
  } catch (error: any) {
    toast.error(`Error al obtener empresas: ${error.message}`);
    return [];
  }
};

export const fetchEmpresaById = async (id: string): Promise<Empresa | null> => {
  try {
    // Get the empresa data first
    const { data, error } = await supabase
      .from("empresas" as any)
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        toast.error('Empresa no encontrada');
        return null;
      }
      throw error;
    }
    
    // Basic empresa data from the first query
    const empresaData = data as any;
    
    // Now fetch related data
    const { data: industriaData, error: industriaError } = await supabase
      .from("sectores" as any)
      .select("nombre")
      .eq("id", empresaData.industria)
      .single();
    
    const { data: ciudadData, error: ciudadError } = await supabase
      .from("ciudades" as any)
      .select("nombre") 
      .eq("id", empresaData.ciudad)
      .single();
    
    // Merge all data
    const empresaFormateada = {
      ...empresaData,
      industria_nombre: industriaError ? 'No disponible' : industriaData?.nombre || 'No disponible',
      ciudad_nombre: ciudadError ? 'No disponible' : ciudadData?.nombre || 'No disponible'
    };
    
    // Ensure proper type conversion
    return empresaFormateada as unknown as Empresa;
  } catch (error: any) {
    toast.error(`Error al obtener empresa: ${error.message}`);
    return null;
  }
};

export const updateEmpresa = async (id: string, empresa: Partial<Omit<Empresa, "id" | "created_at" | "updated_at">>): Promise<Empresa | null> => {
  try {
    // Use type assertion to work around type limitations
    const { data, error } = await supabase
      .from("empresas" as any)
      .update(empresa)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error al actualizar empresa:", error);
      throw error;
    }
    
    // Ensure proper type conversion
    return data as unknown as Empresa;
  } catch (error: any) {
    toast.error(`Error al actualizar empresa: ${error.message}`);
    return null;
  }
};
