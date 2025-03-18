
// Types for the quotation system
export interface EmpresaEmisor {
  logo?: string;
  nombre: string;
  nit: string;
  telefono: string;
  direccion: string;
  email: string;
  firmaNombre?: string;
}

export interface Cliente {
  id?: string;
  nombre: string;
  nit: string;
  telefono: string;
  contacto: string;
  direccion: string;
  email?: string;
  // Added these fields to support the form functionality
  pais_id?: string;
  ciudad_id?: string;
  sector_id?: string;
}

// Renamed from ProductoCotizacion to Producto to match imports
export interface Producto {
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
  productos: Producto[];
  subtotal: number;
  totalIva: number;
  total: number;
  firmaNombre?: string;
  firmaUrl?: string;
  estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida';
}

// For the step wizard
export type CotizacionStep = 'empresa' | 'cliente' | 'productos' | 'preview';
