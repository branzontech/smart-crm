
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
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

          <div className="grid gap-4">
            {proveedores.map((proveedor) => (
              <Card key={proveedor.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{proveedor.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {proveedor.tipoDocumento}: {proveedor.documento}
                    </p>
                    <p className="text-sm text-gray-600">
                      Contacto: {proveedor.contacto}
                    </p>
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

export default ProveedoresIndex;
