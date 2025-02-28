
import React from "react";
import { CuentaCobro } from "@/types/cuentacobro";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText } from "lucide-react";
import { cuentaCobroService } from "@/services/cuentaCobroService";
import { useToast } from "@/hooks/use-toast";

export interface CuentaCobroViewerProps {
  cuenta: CuentaCobro;
}

export const CuentaCobroViewer: React.FC<CuentaCobroViewerProps> = ({ cuenta }) => {
  const { toast } = useToast();

  const handleStatusChange = (newStatus: CuentaCobro["estado"]) => {
    cuentaCobroService.updateStatus(cuenta.id, newStatus);
    toast({
      title: "Estado actualizado",
      description: `La cuenta de cobro ahora está ${newStatus}`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Cuenta de Cobro {cuenta.id}</DialogTitle>
      </DialogHeader>

      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" /> Imprimir
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Descargar PDF
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {/* Encabezado del documento */}
        <div className="flex border-b">
          <div className="w-1/5 bg-orange-500 p-4">
            <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="w-3/5 p-4 text-center border-r">
            <h2 className="text-lg font-bold">FORMATO DE ACTA DE CUENTA DE COBRO</h2>
          </div>
          <div className="w-1/5 p-2 text-xs space-y-1">
            <div className="flex">
              <div className="w-1/3 font-semibold">Formato:</div>
              <div>{cuenta.formato}</div>
            </div>
            <div className="flex">
              <div className="w-1/3 font-semibold">Versión:</div>
              <div>{cuenta.version}</div>
            </div>
            <div className="flex">
              <div className="w-1/3 font-semibold">Actualización:</div>
              <div>{cuenta.fechaActualizacion}</div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-6">
          <div>
            <p className="text-center mb-4">Formato de cuenta de Cobro</p>
            <p className="mb-4">Fecha: [{cuenta.fechaEmision}]</p>

            <div className="space-y-1">
              <p className="font-semibold">De:</p>
              <p>[{cuenta.emisor.nombre}]</p>
              <p>[{cuenta.emisor.ciudad}]</p>
              <p>[{cuenta.emisor.telefono}]</p>
              <p>[{cuenta.emisor.email}]</p>
            </div>

            <div className="space-y-1 mt-4">
              <p className="font-semibold">Para:</p>
              <p>{cuenta.receptor.empresa}</p>
              <p>{cuenta.receptor.direccion}</p>
              <p>{cuenta.receptor.ciudad}</p>
            </div>

            <div className="mt-6">
              <p className="font-semibold">Periodo facturado: [{cuenta.periodo.desde} a {cuenta.periodo.hasta}]</p>
            </div>

            <div className="mt-4">
              <p className="font-semibold">Descripción detallada del servicio:</p>
              <p>[{cuenta.servicio.descripcion} {cuenta.servicio.fase && `${cuenta.servicio.fase} -`} {cuenta.servicio.ordenCompra && `Orden de Compra: ${cuenta.servicio.ordenCompra}`}]</p>
            </div>

            <div className="mt-6">
              <p className="font-semibold">Valor a cobrar: [${new Intl.NumberFormat('es-CO').format(cuenta.valor.monto)}] [{cuenta.valor.montoTexto}]</p>
            </div>

            <div className="mt-10">
              <p className="font-semibold">Datos para el pago:</p>
            </div>
          </div>

          <div className="text-xs text-right text-purple-700">
            www.branzontech.com | Tu aliado en la era Digital
          </div>
        </div>

        {/* Segunda página de datos bancarios */}
        <div className="border-t">
          <div className="flex border-b">
            <div className="w-1/5 bg-orange-500 p-4">
              <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
                <FileText className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="w-3/5 p-4 text-center border-r">
              <h2 className="text-lg font-bold">FORMATO DE ACTA DE CUENTA DE COBRO</h2>
            </div>
            <div className="w-1/5 p-2 text-xs space-y-1">
              <div className="flex">
                <div className="w-1/3 font-semibold">Formato:</div>
                <div>{cuenta.formato}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 font-semibold">Versión:</div>
                <div>{cuenta.version}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 font-semibold">Actualización:</div>
                <div>{cuenta.fechaActualizacion}</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Banco: </span>
                <span>[{cuenta.datosPago.banco}]</span>
              </div>
              <div>
                <span className="font-semibold">Tipo de cuenta: </span>
                <span>[{cuenta.datosPago.tipoCuenta}]</span>
              </div>
              <div>
                <span className="font-semibold">Número de cuenta: </span>
                <span>[{cuenta.datosPago.numeroCuenta}]</span>
              </div>
              <div>
                <span className="font-semibold">Titular de la cuenta: </span>
                <span>[{cuenta.datosPago.titular}]</span>
              </div>
            </div>

            <div className="mt-8">
              <p>Agradezco realizar el pago correspondiente a esta cuenta de cobro dentro de los términos acordados.</p>
            </div>

            <div className="mt-16">
              <p>Cordialmente,</p>
              <p className="mt-10 font-bold">{cuenta.emisor.nombre}</p>
              <div className="w-64 border-t border-black mt-1"></div>
              <p className="mt-1">[{cuenta.emisor.nombre}]</p>
              {cuenta.emisor.documento && <p>[{cuenta.emisor.documento}]</p>}
            </div>

            <div className="text-xs text-right text-purple-700 mt-20">
              www.branzontech.com | Tu aliado en la era Digital
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción según el estado actual */}
      {cuenta.estado === "pendiente" && (
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            className="border-red-200 hover:bg-red-50 text-red-700"
            onClick={() => handleStatusChange("anulada")}
          >
            Anular
          </Button>
          <Button 
            variant="outline" 
            className="border-yellow-200 hover:bg-yellow-50 text-yellow-700"
            onClick={() => handleStatusChange("vencida")}
          >
            Marcar como vencida
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleStatusChange("pagada")}
          >
            Marcar como pagada
          </Button>
        </div>
      )}
    </DialogContent>
  );
};
