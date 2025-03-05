
import React from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmpresaStep } from './wizard-steps/EmpresaStep';
import { ClienteStep } from './wizard-steps/ClienteStep';
import { ProductosStep } from './wizard-steps/ProductosStep';
import { PreviewStep } from './wizard-steps/PreviewStep';
import { ArrowLeft, ArrowRight, Save, Printer, Send } from 'lucide-react';
import { toast } from 'sonner';

export const CotizacionWizard: React.FC = () => {
  const { cotizacion, currentStep, setCurrentStep } = useCotizacion();

  const handlePrevious = () => {
    if (currentStep === 'cliente') setCurrentStep('empresa');
    if (currentStep === 'productos') setCurrentStep('cliente');
    if (currentStep === 'preview') setCurrentStep('productos');
  };

  const handleNext = () => {
    if (currentStep === 'empresa') {
      if (!validateEmpresaStep()) return;
      setCurrentStep('cliente');
    }
    else if (currentStep === 'cliente') {
      if (!validateClienteStep()) return;
      setCurrentStep('productos');
    }
    else if (currentStep === 'productos') {
      if (!validateProductosStep()) return;
      setCurrentStep('preview');
    }
  };

  const validateEmpresaStep = (): boolean => {
    const { empresaEmisor } = cotizacion;
    if (!empresaEmisor.nombre || !empresaEmisor.nit) {
      toast.error('La información de la empresa es requerida');
      return false;
    }
    return true;
  };

  const validateClienteStep = (): boolean => {
    const { cliente } = cotizacion;
    if (!cliente.nombre || !cliente.nit) {
      toast.error('La información del cliente es requerida');
      return false;
    }
    return true;
  };

  const validateProductosStep = (): boolean => {
    if (cotizacion.productos.length === 0) {
      toast.error('Debe agregar al menos un producto');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    // This would connect to a backend service to save the cotizacion
    toast.success("Cotización guardada correctamente");
    console.log('Saving cotizacion:', cotizacion);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSend = () => {
    toast.success("Cotización enviada por correo electrónico");
    console.log('Sending cotizacion:', cotizacion);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'empresa':
        return <EmpresaStep />;
      case 'cliente':
        return <ClienteStep />;
      case 'productos':
        return <ProductosStep />;
      case 'preview':
        return <PreviewStep />;
      default:
        return <EmpresaStep />;
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-0">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setCurrentStep('empresa')}
              className={`px-4 py-4 font-medium text-sm flex items-center ${
                currentStep === 'empresa'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              1. Empresa
            </button>
            <button
              onClick={() => validateEmpresaStep() && setCurrentStep('cliente')}
              className={`px-4 py-4 font-medium text-sm flex items-center ${
                currentStep === 'cliente'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              2. Cliente
            </button>
            <button
              onClick={() => validateClienteStep() && setCurrentStep('productos')}
              className={`px-4 py-4 font-medium text-sm flex items-center ${
                currentStep === 'productos'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              3. Productos
            </button>
            <button
              onClick={() => validateProductosStep() && setCurrentStep('preview')}
              className={`px-4 py-4 font-medium text-sm flex items-center ${
                currentStep === 'preview'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              4. Vista Previa
            </button>
          </nav>
        </div>

        <div className="p-6">
          {renderStep()}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'empresa'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </Button>

          <div className="flex gap-2">
            {currentStep === 'preview' ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
                <Button
                  onClick={handleSend}
                  className="flex items-center gap-2 bg-primary text-primary-foreground"
                >
                  <Send className="h-4 w-4" /> Enviar
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary text-primary-foreground"
              >
                Siguiente <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
