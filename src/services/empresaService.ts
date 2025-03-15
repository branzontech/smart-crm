
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

    const { data, error } = await supabase
      .from("empresas")
      .insert(empresa)
      .select()
      .single();
    
    if (error) {
      console.error("Error al crear empresa:", error);
      throw error;
    }
    
    return data as Empresa;
  } catch (error: any) {
    toast.error(`Error al crear empresa: ${error.message}`);
    throw error;
  }
};

export const fetchEmpresas = async (): Promise<Empresa[]> => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("nombre");
  
  if (error) throw error;
  return data as Empresa[] || [];
};
