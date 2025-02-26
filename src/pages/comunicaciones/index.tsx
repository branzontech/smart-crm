
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ComunicacionesIndex = () => {
  const comunicaciones = [
    {
      id: 1,
      tipo: "email",
      asunto: "Propuesta comercial",
      cliente: "Tech Solutions SA",
      fecha: "2024-03-14",
      estado: "Enviado",
    },
    {
      id: 2,
      tipo: "llamada",
      asunto: "Seguimiento propuesta",
      cliente: "Green Energy Corp",
      fecha: "2024-03-13",
      estado: "Completada",
    },
    {
      id: 3,
      tipo: "mensaje",
      asunto: "Consulta técnica",
      cliente: "Global Logistics",
      fecha: "2024-03-12",
      estado: "Pendiente",
    },
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "llamada":
        return <Phone className="h-4 w-4" />;
      case "mensaje":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Mail className="h-6 w-6 text-teal" />
              <h1 className="text-2xl font-semibold text-gray-900">Comunicaciones</h1>
            </div>
            <Button
              className="bg-teal hover:bg-sage text-white transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Comunicación
            </Button>
          </div>

          <div className="grid gap-4">
            {comunicaciones.map((comunicacion) => (
              <Card key={comunicacion.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(comunicacion.tipo)}
                      <CardTitle className="text-lg">{comunicacion.asunto}</CardTitle>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comunicacion.fecha).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{comunicacion.cliente}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      comunicacion.estado === "Pendiente" 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {comunicacion.estado}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComunicacionesIndex;
