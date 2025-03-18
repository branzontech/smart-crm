
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const OportunidadesIndex = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredOportunidades = oportunidades.filter(
    (oportunidad) =>
      oportunidad.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full overflow-auto pt-[calc(var(--header-height)+1rem)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-teal" />
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Oportunidades</h1>
            </div>
            <Button
              onClick={() => navigate("/ventas/oportunidades/nueva")}
              className="bg-teal hover:bg-sage text-white transition-colors duration-200 w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Oportunidad
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredOportunidades.length > 0 ? (
              filteredOportunidades.map((oportunidad) => (
                <Card key={oportunidad.id} className="p-4 transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{oportunidad.cliente}</h3>
                      <p className="text-sm text-gray-500">
                        Cierre estimado: {new Date(oportunidad.fechaCierre).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-lg">
                        ${oportunidad.valor.toLocaleString()}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
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
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No se encontraron oportunidades con ese criterio</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OportunidadesIndex;
