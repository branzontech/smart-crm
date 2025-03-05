
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Receipt } from "lucide-react";
import { CotizacionProvider } from "@/contexts/CotizacionContext";
import { CotizacionWizard } from "@/components/cotizaciones/CotizacionWizard";

const NuevaCotizacionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full ml-auto transition-all duration-300 ease-in-out overflow-x-hidden" 
            style={{ 
              width: 'calc(100% - var(--sidebar-width))',
              marginLeft: 'var(--sidebar-width)'
            }}>
        <div className="max-w-6xl mx-auto w-full animate-fade-in">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="text-teal hover:text-sage hover:bg-mint/20 mb-4 transition-all duration-200"
              onClick={() => navigate("/ventas/cotizaciones")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Receipt className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Nueva Cotización</h1>
              <p className="text-gray-500 text-sm">Complete los siguientes pasos para crear una nueva cotización</p>
            </div>
          </div>

          <CotizacionProvider>
            <CotizacionWizard />
          </CotizacionProvider>
        </div>
      </main>
    </div>
  );
};

export default NuevaCotizacionPage;
