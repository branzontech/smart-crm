
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";

const CompanyConfigPage: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-6 pt-[var(--header-height)]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Configuración de la Empresa</h1>
            <p className="text-muted-foreground mb-6">
              Configure los datos de su empresa que aparecerán en documentos, cotizaciones y facturas.
            </p>
            
            {/* Este componente sería reemplazado por el formulario real de configuración de la empresa */}
            <div className="bg-muted p-8 rounded-lg text-center">
              <p>Formulario de configuración de empresa pendiente</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyConfigPage;
