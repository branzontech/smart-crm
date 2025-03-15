
import { supabase } from "@/integrations/supabase/client";
import { ArticuloRecaudo } from "./types";

// Insert articulos
export const insertArticulosRecaudo = async (recaudoId: string, articulos: ArticuloRecaudo[]) => {
  if (!articulos || articulos.length === 0) return { error: null };
  
  const articulosToInsert = articulos.map(articulo => ({
    recaudo_id: recaudoId,
    proveedor_id: articulo.proveedor_id,
    descripcion: articulo.descripcion,
    cantidad: articulo.cantidad,
    valor_unitario: articulo.valor_unitario,
    valor_total: articulo.valor_total,
    tasa_iva: articulo.tasa_iva,
    valor_iva: articulo.valor_iva
  }));

  return await supabase
    .from('articulos_recaudo')
    .insert(articulosToInsert);
};

// Get articulos for a recaudo
export const getArticulosRecaudo = async (recaudoId: string) => {
  return await supabase
    .from('articulos_recaudo')
    .select(`
      *,
      proveedor:proveedor_id(id, nombre)
    `)
    .eq('recaudo_id', recaudoId);
};
