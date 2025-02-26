
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Coins, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const RecaudosIndex = () => {
  const navigate = useNavigate();

  const recaudos = [
    {
      id: 1,
      empresa: "Tech Solutions SA",
      monto: 25000,
      estado: "Pagado",
      fechaPago: "2024-03-15",
      metodoPago: "Transferencia",
    },
    {
      id: 2,
      empresa: "Green Energy Corp",
      monto: 45000,
      estado: "Pendiente",
      fechaPago: "2024-04-01",
      metodoPago: "Cheque",
    },
    {
      id: 3,
      empresa: "Global Logistics",
      monto: 15000,
      estado: "En proceso",
      fechaPago: "2024-03-20",
      metodoPago: "Efectivo",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Coins className="h-6 w-6 text-teal" />
              <h1 className="text-2xl font-semibold text-gray-900">Recaudos</h1>
            </div>
            <Button
              onClick={() => navigate("/recaudos/nuevo")}
              className="bg-teal hover:bg-sage text-white transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Recaudo
            </Button>
          </div>

          <div className="grid gap-4">
            {recaudos.map((recaudo) => (
              <Card key={recaudo.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{recaudo.empresa}</h3>
                    <p className="text-sm text-gray-500">
                      Fecha de pago: {new Date(recaudo.fechaPago).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Método: {recaudo.metodoPago}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${recaudo.monto.toLocaleString()}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recaudo.estado === "Pagado"
                        ? "bg-green-100 text-green-800"
                        : recaudo.estado === "Pendiente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {recaudo.estado}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecaudosIndex;
