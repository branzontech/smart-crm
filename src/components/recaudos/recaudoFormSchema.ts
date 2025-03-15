
import { z } from "zod";

export const formSchema = z.object({
  cliente_id: z.string().min(1, { message: "Seleccione un cliente" }),
  clienteNombre: z.string().optional(),
  monto: z.string().min(1, { message: "Ingrese el monto" }),
  subtotal: z.number().min(0, { message: "El subtotal debe ser mayor o igual a 0" }),
  iva: z.number().min(0, { message: "El IVA debe ser mayor o igual a 0" }),
  total: z.number().min(0, { message: "El total debe ser mayor o igual a 0" }),
  metodo_pago: z.string().min(1, { message: "Seleccione un método de pago" }),
  fecha_pago: z.string().min(1, { message: "Seleccione una fecha de pago" }),
  fecha_vencimiento: z.string().min(1, { message: "Seleccione una fecha de vencimiento" }),
  estado: z.string().min(1, { message: "Seleccione un estado" }),
  notas: z.string().optional(),
  archivos: z.array(z.instanceof(File)).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const metodosPago = [
  { id: "transferencia", nombre: "Transferencia Bancaria" },
  { id: "efectivo", nombre: "Efectivo" },
  { id: "cheque", nombre: "Cheque" },
  { id: "tarjeta", nombre: "Tarjeta de Crédito/Débito" },
  { id: "app", nombre: "Aplicación de Pago" },
];

export const estados = [
  { id: "pendiente", nombre: "Pendiente" },
  { id: "enproceso", nombre: "En Proceso" },
  { id: "pagado", nombre: "Pagado" },
  { id: "vencido", nombre: "Vencido" },
];
