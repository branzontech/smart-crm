
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProveedoresIndex = () => {
  const navigate = useNavigate();

  const proveedores = [
    {
      id: 1,
      nombre: "Suministros Industriales S.A.",
      tipoDocumento: "NIT",
      documento: "900.123.456-7",
      contacto: "+57 321 234 5678",
    },
    {
      id: 2,
      nombre: "Juan Pérez Distribuciones",
      tipoDocumento: "CC",
      documento: "79.876.543",
      contacto: "+57 315 987 6543",
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
                <Building2 className="h-6 w-6 text-teal" />
                <h1 className="text-2xl font-semibold text-gray-900">Proveedores</h1>
              </div>
              <Button
                onClick={() => navigate("/proveedores/nuevo")}
                className="bg-teal hover:bg-sage text-white transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Proveedor
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Listado de Proveedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-mint/20">
                      <TableRow>
                        <TableHead className="text-teal">Nombre</TableHead>
                        <TableHead className="text-teal">Tipo Doc.</TableHead>
                        <TableHead className="text-teal">Documento</TableHead>
                        <TableHead className="text-teal">Contacto</TableHead>
                        <TableHead className="text-teal">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proveedores.map((proveedor) => (
                        <TableRow
                          key={proveedor.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                          <TableCell>{proveedor.tipoDocumento}</TableCell>
                          <TableCell>{proveedor.documento}</TableCell>
                          <TableCell>{proveedor.contacto}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              className="text-teal hover:text-sage hover:bg-mint/20"
                              onClick={() => navigate(`/proveedores/${proveedor.id}`)}
                            >
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProveedoresIndex;
