
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
        *,
        industria_nombre:sectores(nombre),
        ciudad_nombre:ciudades(nombre)
      `)
      .order("nombre");
    
    if (error) throw error;
    
    // Formatear los datos para que se muestren correctamente
    const empresasFormateadas = (data as unknown as any[]).map(empresa => ({
      ...empresa,
      industria_nombre: empresa.industria_nombre?.nombre || 'No disponible',
      ciudad_nombre: empresa.ciudad_nombre?.nombre || 'No disponible'
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
    // Use type assertion to work around type limitations
    const { data, error } = await supabase
      .from("empresas" as any)
      .select(`
        *,
        industria_nombre:sectores(nombre),
        ciudad_nombre:ciudades(nombre)
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        toast.error('Empresa no encontrada');
        return null;
      }
      throw error;
    }
    
    // Formatear los datos
    const empresaFormateada = {
      ...data,
      industria_nombre: data.industria_nombre?.nombre || 'No disponible',
      ciudad_nombre: data.ciudad_nombre?.nombre || 'No disponible'
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
