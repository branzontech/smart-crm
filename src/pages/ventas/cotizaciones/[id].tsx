
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { Button } from '@/components/ui/button';
import { getCotizacionById } from '@/services/cotizacionService';
import { Cotizacion } from '@/types/cotizacion';
import { CotizacionViewer } from '@/components/cotizaciones/CotizacionViewer';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const CotizacionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCotizacion = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getCotizacionById(id);
        if (data) {
          setCotizacion(data);
        } else {
          toast.error("No se pudo encontrar la cotización", {
            position: "top-center"
          });
          navigate('/ventas/cotizaciones');
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
        toast.error("Error al cargar la cotización", {
          position: "top-center"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCotizacion();
  }, [id, navigate]);

  const handleStatusChange = async () => {
    if (!id) return;
    
    // Re-fetch the cotizacion to get the updated status
    const updatedCotizacion = await getCotizacionById(id);
    if (updatedCotizacion) {
      setCotizacion(updatedCotizacion);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 p-6 pt-[var(--header-height)]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="text-teal hover:text-sage hover:bg-mint/20 mb-4 transition-all duration-200 print:hidden"
                onClick={() => navigate("/ventas/cotizaciones")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al listado
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f15025]"></div>
              </div>
            ) : cotizacion ? (
              <CotizacionViewer 
                cotizacion={cotizacion} 
                onStatusChange={handleStatusChange}
              />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Cotización no encontrada</h2>
                <p className="text-gray-500 mt-2">La cotización que buscas no existe o ha sido eliminada.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CotizacionDetailPage;
