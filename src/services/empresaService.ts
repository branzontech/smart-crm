
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Empresa {
  id: string;
  nombre: string;
  industria: string;
  empleados: number;
  ciudad: string;
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
  // Use type assertion to work around type limitations
  const { data, error } = await supabase
    .from("empresas" as any)
    .select("*")
    .order("nombre");
  
  if (error) throw error;
  // Ensure proper type conversion
  return (data as unknown as Empresa[]) || [];
};
