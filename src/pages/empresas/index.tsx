
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

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
                    {empresas.map((empresa) => (
                      <TableRow
                        key={empresa.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <TableCell className="font-medium">{empresa.nombre}</TableCell>
                        <TableCell>{empresa.industria}</TableCell>
                        <TableCell>{empresa.empleados}</TableCell>
                        <TableCell>{empresa.ciudad}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="text-teal hover:text-sage hover:bg-mint/20"
                            onClick={() => navigate(`/empresas/${empresa.id}`)}
                          >
                            Ver detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpresasIndex;
