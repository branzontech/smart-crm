
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const ContratosIndex = () => {
  const navigate = useNavigate();

  const contratos = [
    {
      id: 1,
      cliente: "Tech Solutions SA",
      numero: "CTR-2024-001",
      tipo: "Servicios",
      monto: 25000,
      estado: "Activo",
      fechaInicio: "2024-03-15",
      fechaFin: "2025-03-15",
    },
    {
      id: 2,
      cliente: "Green Energy Corp",
      numero: "CTR-2024-002",
      tipo: "Mantenimiento",
      monto: 45000,
      estado: "En firma",
      fechaInicio: "2024-04-01",
      fechaFin: "2025-04-01",
    },
    {
      id: 3,
      cliente: "Global Logistics",
      numero: "CTR-2024-003",
      tipo: "Consultoría",
      monto: 15000,
      estado: "Borrador",
      fechaInicio: "2024-04-15",
      fechaFin: "2024-10-15",
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
              <h1 className="text-2xl font-semibold text-gray-900">Contratos</h1>
            </div>
            <Button
              onClick={() => navigate("/ventas/contratos/nuevo")}
              className="bg-teal hover:bg-sage text-white transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contrato
            </Button>
          </div>

          <div className="grid gap-4">
            {contratos.map((contrato) => (
              <Card key={contrato.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{contrato.cliente}</h3>
                      <span className="text-sm text-gray-500">({contrato.numero})</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Vigencia: {new Date(contrato.fechaInicio).toLocaleDateString()} - {new Date(contrato.fechaFin).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Tipo: {contrato.tipo}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${contrato.monto.toLocaleString()}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      contrato.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : contrato.estado === "En firma"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {contrato.estado}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    className="text-teal hover:text-sage hover:bg-mint/20"
                    onClick={() => navigate(`/ventas/contratos/${contrato.id}`)}
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

export default ContratosIndex;
