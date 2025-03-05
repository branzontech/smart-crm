
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
          <AlertDialogTitle>Confirmar pago</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea marcar este recaudo como pagado? Esta acción no se puede deshacer.
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
