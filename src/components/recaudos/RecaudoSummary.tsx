
import { UseFormWatch } from "react-hook-form";

interface RecaudoSummaryProps {
  watch: UseFormWatch<any>;
}

export function RecaudoSummary({ watch }: RecaudoSummaryProps) {
  return (
    <div className="mt-4 space-y-2 border-t pt-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Subtotal:</span>
        <span>${watch('subtotal').toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Total IVA:</span>
        <span>${watch('iva').toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total:</span>
        <span>${watch('total').toLocaleString()}</span>
      </div>
    </div>
  );
}
