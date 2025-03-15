
import { supabase } from "@/integrations/supabase/client";

export interface ArticuloRecaudo {
  id?: string;
  proveedor_id: string;
  descripcion: string;
  cantidad: number;
  valor_unitario: number;
  valor_total: number;
  tasa_iva: number;
  valor_iva: number;
}

export interface ArchivoRecaudo {
  id?: string;
  nombre: string;
  tipo: string;
  tamano: number;
  path: string;
  file?: File;
}

export interface RecaudoForm {
  cliente_id: string;
  monto: string | number;
  subtotal: number;
  iva: number;
  total: number;
  metodo_pago: string;
  fecha_pago: string;
  fecha_vencimiento: string;
  estado: string;
  notas: string;
  articulos: ArticuloRecaudo[];
  archivos?: File[];
}
