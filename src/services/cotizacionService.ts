
import { supabase } from "@/integrations/supabase/client";
import { Cotizacion } from "@/types/cotizacion";
import { handleSupabaseError } from "@/utils/supabaseHelpers";
import { toast } from "sonner";

// Generate a quotation number
export const generateCotizacionNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `COT-${year}${month}-${random}`;
};

// Save quotation to database
export const saveCotizacion = async (cotizacion: Cotizacion): Promise<string | null> => {
  try {
    // First, insert the main quotation record
    const { data: cotizacionData, error: cotizacionError } = await supabase
      .from("cotizaciones")
      .insert({
        numero: cotizacion.numero,
        fecha_emision: cotizacion.fechaEmision.toISOString(),
        fecha_vencimiento: cotizacion.fechaVencimiento.toISOString(),
        empresa_emisor: cotizacion.empresaEmisor,
        cliente: cotizacion.cliente,
        subtotal: cotizacion.subtotal,
        total_iva: cotizacion.totalIva,
        total: cotizacion.total,
        firma_nombre: cotizacion.firmaNombre,
        firma_url: cotizacion.firmaUrl,
        estado: cotizacion.estado
      })
      .select("id")
      .single();

    if (cotizacionError) throw cotizacionError;
    
    // Explicitly check if cotizacionData is null or doesn't have an id
    if (!cotizacionData || !('id' in cotizacionData)) {
      throw new Error("Failed to retrieve ID after insertion");
    }

    const cotizacionId = cotizacionData.id;

    // Then, insert each product for the quotation
    if (cotizacion.productos.length > 0) {
      const productosMapped = cotizacion.productos.map(producto => ({
        cotizacion_id: cotizacionId,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        precio_unitario: producto.precioUnitario,
        iva: producto.iva,
        total: producto.total
      }));

      const { error: productosError } = await supabase
        .from("productos_cotizacion")
        .insert(productosMapped);

      if (productosError) throw productosError;
    }

    toast.success("Cotización guardada correctamente");
    return cotizacionId;
  } catch (error) {
    handleSupabaseError(error, "Error al guardar la cotización");
    return null;
  }
};

// Get quotation by ID
export const getCotizacionById = async (id: string): Promise<Cotizacion | null> => {
  try {
    // Get main quotation data
    const { data: cotizacionData, error: cotizacionError } = await supabase
      .from("cotizaciones")
      .select("*")
      .eq("id", id)
      .single();

    if (cotizacionError) throw cotizacionError;
    
    // Explicit type check for cotizacionData
    if (!cotizacionData) {
      throw new Error("Cotización no encontrada");
    }

    // Get products for this quotation
    const { data: productosData, error: productosError } = await supabase
      .from("productos_cotizacion")
      .select("*")
      .eq("cotizacion_id", id);

    if (productosError) throw productosError;
    
    // Ensure productosData is an array
    const productos = Array.isArray(productosData) ? productosData : [];

    // Map database structure to our Cotizacion type
    const cotizacion: Cotizacion = {
      id: cotizacionData.id,
      numero: cotizacionData.numero,
      fechaEmision: new Date(cotizacionData.fecha_emision),
      fechaVencimiento: new Date(cotizacionData.fecha_vencimiento),
      empresaEmisor: cotizacionData.empresa_emisor,
      cliente: cotizacionData.cliente,
      productos: productos.map((p: any) => ({
        id: p.id,
        descripcion: p.descripcion,
        cantidad: p.cantidad,
        precioUnitario: p.precio_unitario,
        iva: p.iva,
        total: p.total
      })),
      subtotal: cotizacionData.subtotal,
      totalIva: cotizacionData.total_iva,
      total: cotizacionData.total,
      firmaNombre: cotizacionData.firma_nombre,
      firmaUrl: cotizacionData.firma_url,
      estado: cotizacionData.estado
    };

    return cotizacion;
  } catch (error) {
    handleSupabaseError(error, "Error al obtener la cotización");
    return null;
  }
};

// Get all quotations
export const getAllCotizaciones = async (): Promise<Cotizacion[]> => {
  try {
    const { data, error } = await supabase
      .from("cotizaciones")
      .select("*")
      .order("fecha_emision", { ascending: false });

    if (error) throw error;
    
    // Ensure data is an array
    const cotizaciones = Array.isArray(data) ? data : [];

    return cotizaciones.map((item) => ({
      id: item.id,
      numero: item.numero,
      fechaEmision: new Date(item.fecha_emision),
      fechaVencimiento: new Date(item.fecha_vencimiento),
      empresaEmisor: item.empresa_emisor,
      cliente: item.cliente,
      productos: [],
      subtotal: item.subtotal,
      totalIva: item.total_iva,
      total: item.total,
      firmaNombre: item.firma_nombre,
      firmaUrl: item.firma_url,
      estado: item.estado
    }));
  } catch (error) {
    handleSupabaseError(error, "Error al obtener las cotizaciones");
    return [];
  }
};

// Update quotation status
export const updateCotizacionStatus = async (id: string, estado: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("cotizaciones")
      .update({ estado })
      .eq("id", id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    handleSupabaseError(error, "Error al actualizar el estado de la cotización");
    return false;
  }
};
