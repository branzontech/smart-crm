
import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const EditClientePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simular carga de datos del cliente
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!id || id === 'undefined') {
        toast.error('Cliente no encontrado');
        navigate('/clientes');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id, navigate]);
  
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
            
            <h1 className="text-3xl font-bold mb-6">Editar Cliente</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              /* Placeholder para el formulario real de edición de cliente */
              <div className="bg-muted p-8 rounded-lg text-center">
                <p>Formulario de edición de cliente para ID: {id}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditClientePage;
