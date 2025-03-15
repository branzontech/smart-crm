
import React from 'react';
import { useCotizacion } from '@/contexts/CotizacionContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmpresaStep } from './wizard-steps/EmpresaStep';
import { ClienteStep } from './wizard-steps/ClienteStep';
import { ProductosStep } from './wizard-steps/ProductosStep';
import { PreviewStep } from './wizard-steps/PreviewStep';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Printer, 
  Send, 
  Building2, 
  Users, 
  ShoppingCart, 
  FileText,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { saveCotizacion } from '@/services/cotizacionService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CotizacionWizard: React.FC = () => {
  const { cotizacion, currentStep, setCurrentStep } = useCotizacion();
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

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

  const handleSaveCotizacion = async () => {
    setIsSaving(true);
    try {
      const cotizacionId = await saveCotizacion(cotizacion);
      if (cotizacionId) {
        toast.success("Cotización guardada correctamente");
        // You can redirect to the quotation list or details page
        navigate('/ventas/cotizaciones');
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      toast.error("Error al guardar la cotización");
    } finally {
      setIsSaving(false);
    }
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

  // Calculate progress percentage
  const getProgressPercentage = () => {
    switch (currentStep) {
      case 'empresa': return 25;
      case 'cliente': return 50;
      case 'productos': return 75;
      case 'preview': return 100;
      default: return 25;
    }
  };

  // Get step status: completed, current, or upcoming
  const getStepStatus = (step: string) => {
    const steps = ['empresa', 'cliente', 'productos', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <Card className="bg-white shadow-md w-full">
      <CardContent className="p-0">
        <div className="border-b border-gray-200">
          <div className="px-4 py-4">
            <Progress value={getProgressPercentage()} className="h-2 mb-4" />
            <nav className="flex flex-wrap justify-between">
              {[
                { id: 'empresa', label: 'Empresa', icon: <Building2 /> },
                { id: 'cliente', label: 'Cliente', icon: <Users /> },
                { id: 'productos', label: 'Productos', icon: <ShoppingCart /> },
                { id: 'preview', label: 'Vista Previa', icon: <FileText /> }
              ].map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (status === 'completed' || 
                          (step.id === 'cliente' && validateEmpresaStep()) ||
                          (step.id === 'productos' && validateClienteStep() && validateEmpresaStep()) ||
                          (step.id === 'preview' && validateProductosStep() && validateClienteStep() && validateEmpresaStep())) {
                        setCurrentStep(step.id as any);
                      }
                    }}
                    className={`flex flex-col items-center px-2 py-2 sm:px-4 sm:py-3 rounded-md transition-all duration-300 hover:bg-gray-50 ${
                      status === 'current' ? 'text-primary bg-primary/5' : 
                      status === 'completed' ? 'text-green-600' : 'text-gray-400'
                    } relative group animate-fade-in`}
                  >
                    <div className={`p-2 rounded-full mb-1 transition-all duration-300 ${
                      status === 'current' ? 'bg-primary/10' :
                      status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {status === 'completed' ? 
                        <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                        <div className="h-5 w-5">{step.icon}</div>
                      }
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{step.label}</span>
                    
                    {/* Connecting line */}
                    {step.id !== 'preview' && (
                      <div className="hidden md:block absolute left-full top-1/2 w-8 h-0.5 -translate-y-1/2 -ml-1 -mr-1" style={{ background: status === 'completed' ? '#10b981' : '#e5e7eb' }}></div>
                    )}
                    
                    {/* Tooltip for small screens */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {step.label}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="animate-fade-in">
            {renderStep()}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'empresa'}
            className="flex items-center gap-2 transition-all hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" /> Anterior
          </Button>

          <div className="flex flex-wrap gap-2 justify-end">
            {currentStep === 'preview' ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleSaveCotizacion}
                  disabled={isSaving}
                  className="flex items-center gap-2 transition-all hover:bg-gray-100"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 transition-all hover:bg-gray-100"
                >
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
                <Button
                  onClick={() => toast.success("Cotización enviada por correo electrónico")}
                  className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  <Send className="h-4 w-4" /> Enviar
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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
