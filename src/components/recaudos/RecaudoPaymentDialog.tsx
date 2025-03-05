
import { Recaudo } from "@/pages/recaudos/seguimiento";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check } from "lucide-react";

interface RecaudoPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recaudo: Recaudo | null;
  onConfirm: (id: string) => void;
}

export const RecaudoPaymentDialog = ({ 
  open, 
  onOpenChange, 
  recaudo, 
  onConfirm 
}: RecaudoPaymentDialogProps) => {
  if (!recaudo) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <div className="bg-teal/10 p-2 rounded-full mr-2">
              <Check className="h-4 w-4 text-teal" />
            </div>
            Confirmar pago
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea marcar este recaudo como pagado? Esta acción no se puede deshacer.
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-700">{recaudo.cliente}</p>
              <p className="text-sm text-gray-500">Factura: {recaudo.factura}</p>
              <p className="text-sm text-gray-500">Monto: ${recaudo.monto.toLocaleString()}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-teal hover:bg-teal/90"
            onClick={() => onConfirm(recaudo.id)}
          >
            Confirmar pago
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
