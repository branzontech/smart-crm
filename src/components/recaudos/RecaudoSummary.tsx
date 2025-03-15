
import { UseFormWatch } from "react-hook-form";

interface RecaudoSummaryProps {
  watch: UseFormWatch<any>;
}

export function RecaudoSummary({ watch }: RecaudoSummaryProps) {
  // Obtener los valores con valores predeterminados para evitar errores
  const subtotal = watch('subtotal') || 0;
  const iva = watch('iva') || 0;
  const total = watch('total') || 0;

  return (
    <div className="mt-4 space-y-2 border-t pt-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Subtotal:</span>
        <span>${subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Total IVA:</span>
        <span>${iva.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total:</span>
        <span>${total.toLocaleString()}</span>
      </div>
    </div>
  );
}
