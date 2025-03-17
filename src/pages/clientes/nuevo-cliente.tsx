
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NuevaClientePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-6 pt-[var(--header-height)]">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate("/clientes")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a clientes
            </Button>
            
            <h1 className="text-3xl font-bold mb-6">Nuevo Cliente</h1>
            
            {/* Placeholder para el formulario real de creación de cliente */}
            <div className="bg-muted p-8 rounded-lg text-center">
              <p>Formulario de creación de cliente pendiente</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NuevaClientePage;
