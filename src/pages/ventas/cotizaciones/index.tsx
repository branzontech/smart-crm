
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Wand2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const CotizacionesIndex = () => {
  const navigate = useNavigate();

  const cotizaciones = [
    {
      id: 1,
      cliente: "Tech Solutions SA",
      numero: "COT-2024-001",
      monto: 25000,
      estado: "Enviada",
      fechaEmision: "2024-03-15",
      validezHasta: "2024-04-15",
    },
    {
      id: 2,
      cliente: "Green Energy Corp",
      numero: "COT-2024-002",
      monto: 45000,
      estado: "Aprobada",
      fechaEmision: "2024-03-10",
      validezHasta: "2024-04-10",
    },
    {
      id: 3,
      cliente: "Global Logistics",
      numero: "COT-2024-003",
      monto: 15000,
      estado: "En revisión",
      fechaEmision: "2024-03-12",
      validezHasta: "2024-04-12",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-teal" />
              <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/ventas/cotizaciones/nueva")}
                variant="outline"
                className="text-teal hover:text-sage border-teal hover:border-sage transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Formulario Básico
              </Button>
              <Button
                onClick={() => navigate("/ventas/cotizaciones/nueva-wizard")}
                className="bg-teal hover:bg-sage text-white transition-colors duration-200"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Asistente Avanzado
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {cotizaciones.map((cotizacion) => (
              <Card key={cotizacion.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{cotizacion.cliente}</h3>
                      <span className="text-sm text-gray-500">({cotizacion.numero})</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Emitida: {new Date(cotizacion.fechaEmision).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Válida hasta: {new Date(cotizacion.validezHasta).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${cotizacion.monto.toLocaleString()}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cotizacion.estado === "Aprobada"
                        ? "bg-green-100 text-green-800"
                        : cotizacion.estado === "Enviada"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {cotizacion.estado}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className="text-teal hover:text-sage hover:bg-mint/20"
                    onClick={() => navigate(`/ventas/cotizaciones/${cotizacion.id}`)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CotizacionesIndex;
