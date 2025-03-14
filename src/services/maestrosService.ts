
import { supabase } from "@/integrations/supabase/client";
import { Sector, TipoServicio, Pais, Ciudad, OrigenCliente } from "@/types/maestros";

// Sectores
export const fetchSectores = async (): Promise<Sector[]> => {
  const { data, error } = await supabase
    .from("sectores")
    .select("*")
    .order("nombre");
  
  if (error) throw error;
  return data || [];
};

export const createSector = async (sector: Omit<Sector, "id" | "created_at" | "updated_at">): Promise<Sector> => {
  const { data, error } = await supabase
    .from("sectores")
    .insert(sector)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateSector = async (id: string, sector: Partial<Omit<Sector, "id" | "created_at" | "updated_at">>): Promise<Sector> => {
  const { data, error } = await supabase
    .from("sectores")
    .update(sector)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSector = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("sectores")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};

// Tipos de Servicios
export const fetchTiposServicios = async (): Promise<TipoServicio[]> => {
  const { data, error } = await supabase
    .from("tipos_servicios")
    .select("*")
    .order("nombre");
  
  if (error) throw error;
  return data || [];
};

export const createTipoServicio = async (tipoServicio: Omit<TipoServicio, "id" | "created_at" | "updated_at">): Promise<TipoServicio> => {
  const { data, error } = await supabase
    .from("tipos_servicios")
    .insert(tipoServicio)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTipoServicio = async (id: string, tipoServicio: Partial<Omit<TipoServicio, "id" | "created_at" | "updated_at">>): Promise<TipoServicio> => {
  const { data, error } = await supabase
    .from("tipos_servicios")
    .update(tipoServicio)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTipoServicio = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("tipos_servicios")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};

// Países
export const fetchPaises = async (): Promise<Pais[]> => {
  const { data, error } = await supabase
    .from("paises")
    .select("*")
    .order("nombre");
  
  if (error) throw error;
  return data || [];
};

export const createPais = async (pais: Omit<Pais, "id" | "created_at" | "updated_at">): Promise<Pais> => {
  const { data, error } = await supabase
    .from("paises")
    .insert(pais)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePais = async (id: string, pais: Partial<Omit<Pais, "id" | "created_at" | "updated_at">>): Promise<Pais> => {
  const { data, error } = await supabase
    .from("paises")
    .update(pais)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePais = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("paises")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};

// Ciudades
export const fetchCiudades = async (): Promise<Ciudad[]> => {
  const { data, error } = await supabase
    .from("ciudades")
    .select("*, pais:pais_id(id, nombre)")
    .order("nombre");
  
  if (error) throw error;
  return data || [];
};

export const createCiudad = async (ciudad: Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">): Promise<Ciudad> => {
  const { data, error } = await supabase
    .from("ciudades")
    .insert(ciudad)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCiudad = async (id: string, ciudad: Partial<Omit<Ciudad, "id" | "created_at" | "updated_at" | "pais">>): Promise<Ciudad> => {
  const { data, error } = await supabase
    .from("ciudades")
    .update(ciudad)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCiudad = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("ciudades")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};

// Orígenes de Clientes
export const fetchOrigenesCliente = async (): Promise<OrigenCliente[]> => {
  const { data, error } = await supabase
    .from("origenes_cliente")
    .select("*")
    .order("nombre");
  
  if (error) throw error;
  return data || [];
};

export const createOrigenCliente = async (origenCliente: Omit<OrigenCliente, "id" | "created_at" | "updated_at">): Promise<OrigenCliente> => {
  const { data, error } = await supabase
    .from("origenes_cliente")
    .insert(origenCliente)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateOrigenCliente = async (id: string, origenCliente: Partial<Omit<OrigenCliente, "id" | "created_at" | "updated_at">>): Promise<OrigenCliente> => {
  const { data, error } = await supabase
    .from("origenes_cliente")
    .update(origenCliente)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteOrigenCliente = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("origenes_cliente")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
};
