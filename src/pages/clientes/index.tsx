
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeguimientoMenu } from "@/components/clientes/SeguimientoMenu";

const ClientesIndex = () => {
  const navigate = useNavigate();

  // Este es un array de ejemplo - normalmente vendría de una base de datos
  const clientes = [
    { id: 1, nombre: "Juan Pérez", empresa: "Empresa A", email: "juan@empresa-a.com" },
    { id: 2, nombre: "María García", empresa: "Empresa B", email: "maria@empresa-b.com" },
    { id: 3, nombre: "Carlos López", empresa: "Empresa C", email: "carlos@empresa-c.com" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-teal" />
                <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
              </div>
              <Button
                onClick={() => navigate("/clientes/nuevo")}
                className="bg-teal hover:bg-sage text-white transition-colors duration-200"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </div>

            <Tabs defaultValue="lista" className="space-y-4">
              <TabsList>
                <TabsTrigger value="lista">Lista de Clientes</TabsTrigger>
                <TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
              </TabsList>

              <TabsContent value="lista">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-mint/20">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                            Empresa
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clientes.map((cliente) => (
                          <tr
                            key={cliente.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {cliente.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {cliente.empresa}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {cliente.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <Button
                                variant="ghost"
                                className="text-teal hover:text-sage hover:bg-mint/20"
                                onClick={() => navigate(`/clientes/${cliente.id}`)}
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
              </TabsContent>

              <TabsContent value="seguimiento">
                <SeguimientoMenu />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientesIndex;
