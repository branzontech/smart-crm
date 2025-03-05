
// Types for the quotation system
export interface EmpresaEmisor {
  logo?: string;
  nombre: string;
  nit: string;
  telefono: string;
  direccion: string;
  firmaNombre?: string; // Added for signature name in preview
}

export interface Cliente {
  id?: string;
  nombre: string;
  nit: string;
  telefono: string;
  contacto: string;
  direccion: string;
}

export interface ProductoCotizacion {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  iva: number; // percentage
  total: number;
}

export interface Cotizacion {
  id?: string;
  numero: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  empresaEmisor: EmpresaEmisor;
  cliente: Cliente;
  productos: ProductoCotizacion[];
  subtotal: number;
  totalIva: number;
  total: number;
  firmaNombre?: string;
  firmaUrl?: string;
  estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida';
}

// For the step wizard
export type CotizacionStep = 'empresa' | 'cliente' | 'productos' | 'preview';
