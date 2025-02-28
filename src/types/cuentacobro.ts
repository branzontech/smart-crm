
export interface CuentaCobro {
  id: string;
  formato: string;
  version: string;
  fechaActualizacion: string;
  fechaEmision: string;
  emisor: {
    nombre: string;
    ciudad: string;
    telefono: string;
    email: string;
    documento?: string;
  };
  receptor: {
    empresa: string;
    direccion: string;
    ciudad: string;
  };
  periodo: {
    desde: string;
    hasta: string;
  };
  servicio: {
    descripcion: string;
    proyecto?: string;
    fase?: string;
    ordenCompra?: string;
  };
  valor: {
    monto: number;
    montoTexto: string;
  };
  datosPago: {
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
    titular: string;
  };
  estado: "pendiente" | "pagada" | "vencida" | "anulada";
  fechaVencimiento?: string;
  notas?: string;
}

export interface CuentaCobroFormData {
  fechaEmision: string;
  emisor: {
    nombre: string;
    ciudad: string;
    telefono: string;
    email: string;
    documento?: string;
  };
  receptor: {
    empresa: string;
    direccion: string;
    ciudad: string;
  };
  periodo: {
    desde: string;
    hasta: string;
  };
  servicio: {
    descripcion: string;
    proyecto?: string;
    fase?: string;
    ordenCompra?: string;
  };
  valor: {
    monto: number;
  };
  datosPago: {
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
    titular: string;
  };
  fechaVencimiento?: string;
  notas?: string;
}
