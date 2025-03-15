
import { useEffect } from "react";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Articulo } from "./NuevoArticuloForm";

interface RecaudoSummaryProps {
  watch: UseFormWatch<any>;
  articulos?: Articulo[];
  setValue?: UseFormSetValue<any>;
}

export function RecaudoSummary({ watch, articulos = [], setValue }: RecaudoSummaryProps) {
  // Obtener los valores con valores predeterminados para evitar errores
  const subtotal = watch('subtotal') || 0;
  const iva = watch('iva') || 0;
  const total = watch('total') || 0;

  // Calcular los totales cada vez que cambie la lista de artículos
  useEffect(() => {
    if (setValue && articulos.length > 0) {
      const newSubtotal = articulos.reduce((sum, item) => sum + (item.valor_total || 0), 0);
      const newIva = articulos.reduce((sum, item) => sum + (item.valor_iva || 0), 0);
      const newTotal = newSubtotal + newIva;
      
      console.log("RecaudoSummary - Calculando totales con", articulos.length, "artículos");
      console.log("RecaudoSummary - Nuevos totales:", { newSubtotal, newIva, newTotal });
      
      setValue('subtotal', newSubtotal);
      setValue('iva', newIva);
      setValue('total', newTotal);
      setValue('monto', newTotal.toString());
    }
  }, [articulos, setValue]);

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
