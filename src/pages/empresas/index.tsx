
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { fetchEmpresas, Empresa } from "@/services/empresaService";
import { toast } from "sonner";

const EmpresasIndex = () => {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        setIsLoading(true);
        const data = await fetchEmpresas();
        setEmpresas(data);
      } catch (error: any) {
        toast.error(`Error al cargar empresas: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmpresas();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <Header />
        <main className="flex-1 content-container pt-[var(--header-height)]">
          <div className="max-w-content">
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

            <Card>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-teal" />
                  <span className="ml-2">Cargando empresas...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-mint/20">
                      <TableRow>
                        <TableHead className="text-teal">Nombre</TableHead>
                        <TableHead className="text-teal">Industria</TableHead>
                        <TableHead className="text-teal">Empleados</TableHead>
                        <TableHead className="text-teal">Ciudad</TableHead>
                        <TableHead className="text-teal">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {empresas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No hay empresas registradas. Crea una nueva empresa para comenzar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        empresas.map((empresa) => (
                          <TableRow
                            key={empresa.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <TableCell className="font-medium">{empresa.nombre}</TableCell>
                            <TableCell>{empresa.industria_nombre || 'No disponible'}</TableCell>
                            <TableCell>{empresa.empleados}</TableCell>
                            <TableCell>{empresa.ciudad_nombre || 'No disponible'}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  className="text-teal hover:text-sage hover:bg-mint/20"
                                  onClick={() => navigate(`/empresas/${empresa.id}`)}
                                >
                                  Ver detalles
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  onClick={() => navigate(`/empresas/${empresa.id}/editar`)}
                                >
                                  Editar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpresasIndex;
