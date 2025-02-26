
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";

const VentasIndex = () => {
  const navigate = useNavigate();

  const ventas = [
    { id: 1, cliente: "Tech Solutions SA", monto: 15000, estado: "En proceso", fechaCierre: "2024-03-30" },
    { id: 2, cliente: "Green Energy Corp", monto: 25000, estado: "Ganada", fechaCierre: "2024-02-15" },
    { id: 3, cliente: "Global Logistics", monto: 18000, estado: "En negociación", fechaCierre: "2024-04-10" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-teal" />
              <h1 className="text-2xl font-semibold text-gray-900">Ventas</h1>
            </div>
            <Button
              onClick={() => navigate("/ventas/nueva")}
              className="bg-teal hover:bg-sage text-white transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Oportunidad
            </Button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mint/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Fecha Cierre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventas.map((venta) => (
                    <tr
                      key={venta.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venta.cliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${venta.monto.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venta.estado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(venta.fechaCierre).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Button
                          variant="ghost"
                          className="text-teal hover:text-sage hover:bg-mint/20"
                          onClick={() => navigate(`/ventas/${venta.id}`)}
                        >
                          Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VentasIndex;
