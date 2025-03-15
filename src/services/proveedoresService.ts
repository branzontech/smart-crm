
import { supabase } from "@/integrations/supabase/client";

export interface Proveedor {
  id: string;
  nombre: string;
  tipo_documento: string;
  documento: string;
  contacto: string;
  tipo_proveedor: string;
  sector_id?: string;
  descripcion?: string;
  created_at: string;
  updated_at: string;
}

export type CreateProveedorInput = Omit<Proveedor, "id" | "created_at" | "updated_at">;

export async function createProveedor(proveedor: CreateProveedorInput) {
  const { data, error } = await supabase
    .from("proveedores")
    .insert(proveedor)
    .select("*")
    .single();
  
  if (error) throw error;
  return data;
}

export async function getProveedores() {
  const { data, error } = await supabase
    .from("proveedores")
    .select("*, sectores(id, nombre)")
    .order("nombre");
  
  if (error) throw error;
  return { data, error: null };
}

export async function getProveedorById(id: string) {
  const { data, error } = await supabase
    .from("proveedores")
    .select("*, sectores(id, nombre)")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProveedor(id: string, updates: Partial<CreateProveedorInput>) {
  const { data, error } = await supabase
    .from("proveedores")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProveedor(id: string) {
  const { error } = await supabase
    .from("proveedores")
    .delete()
    .eq("id", id);
  
  return { error };
}
