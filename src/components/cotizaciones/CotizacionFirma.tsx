
interface CotizacionFirmaProps {
  firmaNombre?: string;
  firmaUrl?: string;
  nombreEmpresa: string;
}

export const CotizacionFirma = ({ firmaNombre, firmaUrl, nombreEmpresa }: CotizacionFirmaProps) => {
  if (!firmaNombre) return null;
  
  return (
    <div className="mt-10 pt-10 border-t text-center print:mt-3 print:pt-3">
      <div className="inline-block">
        {firmaUrl && (
          <img 
            src={firmaUrl} 
            alt="Firma" 
            className="h-16 mx-auto mb-2 print:h-12 print:mb-1"
          />
        )}
        <div className="w-48 border-t border-black mt-2 pt-1 mx-auto print:w-32 print:mt-1 print:pt-0.5">
          <p className="font-medium">{firmaNombre}</p>
          <p className="text-sm text-gray-600 print:text-xs">{nombreEmpresa}</p>
        </div>
      </div>
    </div>
  );
};
