
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { CotizacionProvider } from "@/contexts/CotizacionContext";
import { CotizacionWizard } from "@/components/cotizaciones/CotizacionWizard";

const NuevaCotizacionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 w-full ml-auto transition-all duration-300 ease-in-out" 
            style={{ 
              width: 'calc(100% - var(--sidebar-width))',
              marginLeft: 'var(--sidebar-width)'
            }}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="text-teal hover:text-sage hover:bg-mint/20 mb-4"
              onClick={() => navigate("/ventas/cotizaciones")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al listado
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-teal" />
            <h1 className="text-2xl font-semibold text-gray-900">Nueva Cotización</h1>
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
