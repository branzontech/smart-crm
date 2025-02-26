
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Building2, Plus } from "lucide-react";

const EmpresasIndex = () => {
  const navigate = useNavigate();

  const empresas = [
    { id: 1, nombre: "Tech Solutions SA", industria: "Tecnología", empleados: 150, ciudad: "Buenos Aires" },
    { id: 2, nombre: "Green Energy Corp", industria: "Energía", empleados: 75, ciudad: "Córdoba" },
    { id: 3, nombre: "Global Logistics", industria: "Logística", empleados: 200, ciudad: "Rosario" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-teal" />
              <h1 className="text-2xl font-semibold text-gray-900">Empresas</h1>
            </div>
            <Button
              onClick={() => navigate("/empresas/nuevo")}
              className="bg-teal hover:bg-sage text-white transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mint/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Industria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Empleados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Ciudad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {empresas.map((empresa) => (
                    <tr
                      key={empresa.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa.industria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa.empleados}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {empresa.ciudad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Button
                          variant="ghost"
                          className="text-teal hover:text-sage hover:bg-mint/20"
                          onClick={() => navigate(`/empresas/${empresa.id}`)}
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

export default EmpresasIndex;
