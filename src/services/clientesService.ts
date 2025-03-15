
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ClienteForm {
  tipoPersona: "natural" | "juridica";
  tipoDocumento: string;
  documento: string;
  nombre: string;
  apellidos?: string;
  empresa?: string;
  cargo?: string;
  email: string;
  telefono: string;
  tipo: "potencial" | "activo" | "inactivo" | "recurrente" | "referido" | "suspendido" | "corporativo";
  tipoServicio: string;
  sector: string;
  direccion: string;
  ciudad: string;
  pais: string;
  notas?: string;
  origen: string;
  presupuestoEstimado?: string;
}

export interface Cliente extends Omit<ClienteForm, 'tipoServicio' | 'sector' | 'ciudad' | 'pais' | 'origen'> {
  id: string;
  tipo_servicio_id: string;
  sector_id: string;
  ciudad_id: string;
  pais_id: string;
  origen_id: string;
  created_at: string;
  updated_at: string;
}

export const createCliente = async (clienteData: ClienteForm): Promise<{ data: Cliente | null; error: Error | null }> => {
  try {
    // Transform form data to match database structure
    const cliente = {
      tipo_persona: clienteData.tipoPersona,
      tipo_documento: clienteData.tipoDocumento,
      documento: clienteData.documento,
      nombre: clienteData.nombre,
      apellidos: clienteData.apellidos || null,
      empresa: clienteData.empresa || null,
      cargo: clienteData.cargo || null,
      email: clienteData.email,
      telefono: clienteData.telefono,
      tipo: clienteData.tipo,
      tipo_servicio_id: clienteData.tipoServicio,
      sector_id: clienteData.sector,
      direccion: clienteData.direccion,
      ciudad_id: clienteData.ciudad,
      pais_id: clienteData.pais,
      notas: clienteData.notas || null,
      origen_id: clienteData.origen,
      presupuesto_estimado: clienteData.presupuestoEstimado ? Number(clienteData.presupuestoEstimado) : null,
    };

    const { data, error } = await supabase
      .from("clientes")
      .insert(cliente)
      .select('*')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error creando cliente:", error);
    toast.error(`Error al crear cliente: ${error.message}`);
    return { data: null, error };
  }
};

export const getClientes = async (): Promise<{ data: Cliente[] | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select(`
        *,
        sector:sector_id(id, nombre),
        tipo_servicio:tipo_servicio_id(id, nombre),
        ciudad:ciudad_id(id, nombre, pais:pais_id(id, nombre)),
        pais:pais_id(id, nombre),
        origen:origen_id(id, nombre)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error("Error obteniendo clientes:", error);
    toast.error(`Error al cargar clientes: ${error.message}`);
    return { data: null, error };
  }
};

export const getClienteById = async (id: string): Promise<{ data: Cliente | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from("clientes")
      .select(`
        *,
        sector:sector_id(id, nombre),
        tipo_servicio:tipo_servicio_id(id, nombre),
        ciudad:ciudad_id(id, nombre, pais:pais_id(id, nombre)),
        pais:pais_id(id, nombre),
        origen:origen_id(id, nombre)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error obteniendo cliente ${id}:`, error);
    return { data: null, error };
  }
};

export const updateCliente = async (id: string, clienteData: Partial<ClienteForm>): Promise<{ data: Cliente | null; error: Error | null }> => {
  try {
    // Transform form data to match database structure
    const updateData: Record<string, any> = {};
    
    if (clienteData.tipoPersona) updateData.tipo_persona = clienteData.tipoPersona;
    if (clienteData.tipoDocumento) updateData.tipo_documento = clienteData.tipoDocumento;
    if (clienteData.documento) updateData.documento = clienteData.documento;
    if (clienteData.nombre) updateData.nombre = clienteData.nombre;
    if (clienteData.apellidos !== undefined) updateData.apellidos = clienteData.apellidos || null;
    if (clienteData.empresa !== undefined) updateData.empresa = clienteData.empresa || null;
    if (clienteData.cargo !== undefined) updateData.cargo = clienteData.cargo || null;
    if (clienteData.email) updateData.email = clienteData.email;
    if (clienteData.telefono) updateData.telefono = clienteData.telefono;
    if (clienteData.tipo) updateData.tipo = clienteData.tipo;
    if (clienteData.tipoServicio) updateData.tipo_servicio_id = clienteData.tipoServicio;
    if (clienteData.sector) updateData.sector_id = clienteData.sector;
    if (clienteData.direccion) updateData.direccion = clienteData.direccion;
    if (clienteData.ciudad) updateData.ciudad_id = clienteData.ciudad;
    if (clienteData.pais) updateData.pais_id = clienteData.pais;
    if (clienteData.notas !== undefined) updateData.notas = clienteData.notas || null;
    if (clienteData.origen) updateData.origen_id = clienteData.origen;
    if (clienteData.presupuestoEstimado !== undefined) {
      updateData.presupuesto_estimado = clienteData.presupuestoEstimado 
        ? Number(clienteData.presupuestoEstimado) 
        : null;
    }

    const { data, error } = await supabase
      .from("clientes")
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    console.error(`Error actualizando cliente ${id}:`, error);
    toast.error(`Error al actualizar cliente: ${error.message}`);
    return { data: null, error };
  }
};

export const deleteCliente = async (id: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error(`Error eliminando cliente ${id}:`, error);
    toast.error(`Error al eliminar cliente: ${error.message}`);
    return { error };
  }
};
