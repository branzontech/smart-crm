import { supabase } from "@/integrations/supabase/client";
import { Cotizacion } from "@/types/cotizacion";
import { handleSupabaseError } from "@/utils/supabaseHelpers";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Generate a quotation number
export const generateCotizacionNumber = async (): Promise<string> => {
  // Try to get a sequence-based number from the database first
  try {
    const { data, error } = await supabase.rpc('get_next_cotizacion_numero');
    
    if (error) {
      console.error("Error getting cotización number:", error);
      throw error;
    }
    
    if (data) {
      return data;
    }
  } catch (error) {
    console.warn("Fallback to client-side generation due to error:", error);
  }
  
  // Fallback to client-side generation
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `COT-${year}${month}-${random}`;
};

// Validate cotizacion before saving
const validateCotizacion = (cotizacion: Cotizacion): { isValid: boolean, errors: string[] } => {
  const errors: string[] = [];
  
  // Validate empresa emisor
  if (!cotizacion.empresaEmisor.nombre) errors.push("Nombre de empresa emisora requerido");
  if (!cotizacion.empresaEmisor.nit) errors.push("NIT de empresa emisora requerido");
  
  // Validate cliente
  if (!cotizacion.cliente.nombre) errors.push("Nombre de cliente requerido");
  if (!cotizacion.cliente.nit) errors.push("NIT de cliente requerido");
  
  // Validate productos
  if (cotizacion.productos.length === 0) {
    errors.push("Debe agregar al menos un producto");
  } else {
    cotizacion.productos.forEach((producto, index) => {
      if (!producto.descripcion) errors.push(`Descripción del producto ${index + 1} requerida`);
      if (producto.cantidad <= 0) errors.push(`Cantidad del producto ${index + 1} inválida`);
      if (producto.precioUnitario < 0) errors.push(`Precio unitario del producto ${index + 1} inválido`);
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Save quotation to database
export const saveCotizacion = async (cotizacion: Cotizacion): Promise<string | null> => {
  try {
    // Validate cotizacion before saving
    const { isValid, errors } = validateCotizacion(cotizacion);
    
    if (!isValid) {
      const errorMessage = errors.join(", ");
      toast.error(`Error de validación: ${errorMessage}`);
      return null;
    }
    
    // Convert our application types to database types
    const cotizacionDB = {
      numero: cotizacion.numero,
      fecha_emision: cotizacion.fechaEmision.toISOString(),
      fecha_vencimiento: cotizacion.fechaVencimiento.toISOString(),
      empresa_emisor: cotizacion.empresaEmisor as unknown as Json,
      cliente: cotizacion.cliente as unknown as Json,
      subtotal: cotizacion.subtotal,
      total_iva: cotizacion.totalIva,
      total: cotizacion.total,
      firma_nombre: cotizacion.firmaNombre,
      firma_url: cotizacion.firmaUrl,
      estado: cotizacion.estado
    };

    console.log("Guardando cotización:", cotizacionDB);

    // First, insert the main quotation record
    const { data: cotizacionData, error: cotizacionError } = await supabase
      .from("cotizaciones")
      .insert(cotizacionDB)
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
      empresaEmisor: cotizacionData.empresa_emisor as any,
      cliente: cotizacionData.cliente as any,
      productos: productos.map((p) => ({
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
      estado: cotizacionData.estado as "borrador" | "enviada" | "aprobada" | "rechazada" | "vencida"
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
    
    console.log("Datos obtenidos de cotizaciones:", data);
    
    // Ensure data is an array
    const cotizaciones = Array.isArray(data) ? data : [];

    // Map the database results to our application type
    return cotizaciones.map((item) => ({
      id: item.id,
      numero: item.numero,
      fechaEmision: new Date(item.fecha_emision),
      fechaVencimiento: new Date(item.fecha_vencimiento),
      empresaEmisor: item.empresa_emisor as any,
      cliente: item.cliente as any,
      productos: [], // No cargamos los productos en la lista para mayor rendimiento
      subtotal: item.subtotal,
      totalIva: item.total_iva,
      total: item.total,
      firmaNombre: item.firma_nombre,
      firmaUrl: item.firma_url,
      estado: item.estado as "borrador" | "enviada" | "aprobada" | "rechazada" | "vencida"
    }));
  } catch (error) {
    handleSupabaseError(error, "Error al obtener las cotizaciones");
    return [];
  }
};

// Update quotation status
export const updateCotizacionStatus = async (id: string, estado: string): Promise<boolean> => {
  try {
    // Validate the estado value matches one of the allowed values
    const validEstados = ["borrador", "enviada", "aprobada", "rechazada", "vencida"];
    if (!validEstados.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}. Debe ser uno de: ${validEstados.join(", ")}`);
    }
    
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
