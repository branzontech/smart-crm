
import React, { useRef } from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PreviewStep: React.FC = () => {
  const { cotizacion, updateEmpresaEmisor } = useCotizacion();
  const { 
    empresaEmisor, 
    cliente, 
    productos, 
    numero, 
    fechaEmision, 
    fechaVencimiento,
    subtotal,
    totalIva,
    total
  } = cotizacion;

  const signatureRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleFirmaNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEmpresaEmisor({ firmaNombre: e.target.value });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Vista Previa de la Cotización</h2>
        <p className="text-gray-500">
          Revise todos los detalles antes de enviar o imprimir.
        </p>
      </div>

      <div className="border rounded-md overflow-hidden mb-6 print:border-none" id="cotizacion-preview">
        {/* Encabezado */}
        <div className="bg-primary text-primary-foreground p-4 sm:p-6 print:bg-primary print:text-primary-foreground">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              {empresaEmisor.logo && (
                <img 
                  src={empresaEmisor.logo} 
                  alt="Logo"
                  className="h-16 w-auto object-contain"
                />
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{empresaEmisor.nombre}</h1>
                <p>NIT: {empresaEmisor.nit}</p>
              </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <h2 className="text-lg sm:text-xl font-semibold">COTIZACIÓN</h2>
              <p className="font-bold">#{numero}</p>
              <p>Fecha: {format(fechaEmision, 'dd/MM/yyyy', { locale: es })}</p>
              <p>Vence: {format(fechaVencimiento, 'dd/MM/yyyy', { locale: es })}</p>
            </div>
          </div>
        </div>

        {/* Información de empresa y cliente */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
          <div>
            <h3 className="font-semibold text-lg mb-2">Empresa Emisora</h3>
            <div className="space-y-1">
              <p>{empresaEmisor.nombre}</p>
              <p>NIT: {empresaEmisor.nit}</p>
              <p>Teléfono: {empresaEmisor.telefono}</p>
              <p>Dirección: {empresaEmisor.direccion}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Cliente</h3>
            <div className="space-y-1">
              <p>{cliente.nombre}</p>
              <p>NIT: {cliente.nit}</p>
              <p>Contacto: {cliente.contacto}</p>
              <p>Teléfono: {cliente.telefono}</p>
              <p>Dirección: {cliente.direccion}</p>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="p-4 sm:p-6 bg-white border-t">
          <h3 className="font-semibold text-lg mb-4">Detalles de la Cotización</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">IVA</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.descripcion}</TableCell>
                    <TableCell className="text-right">{producto.cantidad}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(producto.precioUnitario)}
                    </TableCell>
                    <TableCell className="text-right">{producto.iva}%</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(producto.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totales */}
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-64 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">IVA:</span>
                <span>{formatCurrency(totalIva)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notas y Firma */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Condiciones</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Cotización válida por 30 días a partir de la fecha de emisión.</li>
                <li>Precios sujetos a cambio sin previo aviso.</li>
                <li>Forma de pago: A convenir.</li>
                <li>Tiempo de entrega: A convenir.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Firma</h3>
              <div className="mt-4 print:mt-10 border-t pt-2" ref={signatureRef}>
                <div className="space-y-2 mb-4 print:hidden">
                  <Label htmlFor="firmaNombre">Nombre del Firmante</Label>
                  <Input
                    id="firmaNombre"
                    value={empresaEmisor.firmaNombre || ''}
                    onChange={handleFirmaNombreChange}
                    placeholder="Nombre y cargo"
                  />
                </div>
                
                <p className="text-center print:mt-16">
                  {empresaEmisor.firmaNombre || 'Firma Autorizada'}
                </p>
                <p className="text-center text-sm text-gray-500">
                  {empresaEmisor.nombre}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <h3 className="font-semibold text-lg mb-2">Acciones</h3>
        <p className="text-gray-500 mb-4">
          Puede guardar esta cotización, enviarla por email o imprimirla directamente.
        </p>
        <p className="text-sm text-gray-500">
          Nota: Los botones para estas acciones están disponibles en la parte inferior del wizard.
        </p>
      </div>
    </div>
  );
};
