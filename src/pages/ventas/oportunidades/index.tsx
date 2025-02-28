
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const OportunidadesIndex = () => {
  const navigate = useNavigate();

  const oportunidades = [
    {
      id: 1,
      cliente: "Tech Solutions SA",
      valor: 25000,
      etapa: "Calificación",
      probabilidad: 30,
      fechaCierre: "2024-04-15",
    },
    {
      id: 2,
      cliente: "Green Energy Corp",
      valor: 45000,
      etapa: "Propuesta",
      probabilidad: 60,
      fechaCierre: "2024-03-30",
    },
    {
      id: 3,
      cliente: "Global Logistics",
      valor: 15000,
      etapa: "Negociación",
      probabilidad: 80,
      fechaCierre: "2024-04-05",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-teal" />
                <h1 className="text-2xl font-semibold text-gray-900">Oportunidades</h1>
              </div>
              <Button
                onClick={() => navigate("/ventas/oportunidades/nueva")}
                className="bg-teal hover:bg-sage text-white transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Oportunidad
              </Button>
            </div>

            <div className="grid gap-4">
              {oportunidades.map((oportunidad) => (
                <Card key={oportunidad.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{oportunidad.cliente}</h3>
                      <p className="text-sm text-gray-500">
                        Cierre estimado: {new Date(oportunidad.fechaCierre).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${oportunidad.valor.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          oportunidad.probabilidad >= 70
                            ? "bg-green-100 text-green-800"
                            : oportunidad.probabilidad >= 40
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {oportunidad.probabilidad}% prob.
                        </span>
                        <span className="text-sm text-gray-600">{oportunidad.etapa}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      className="text-teal hover:text-sage hover:bg-mint/20"
                      onClick={() => navigate(`/ventas/oportunidades/${oportunidad.id}`)}
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
    </div>
  );
};

export default OportunidadesIndex;
