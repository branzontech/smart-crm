
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReportesIndex = () => {
  const ventasMensuales = [
    { mes: 'Ene', ventas: 4000 },
    { mes: 'Feb', ventas: 3000 },
    { mes: 'Mar', ventas: 2000 },
    { mes: 'Abr', ventas: 2780 },
    { mes: 'May', ventas: 1890 },
    { mes: 'Jun', ventas: 2390 },
  ];

  const metricas = [
    { titulo: "Total Clientes", valor: "156", icono: Users, incremento: "+12% vs mes anterior" },
    { titulo: "Ventas Totales", valor: "$45,678", icono: TrendingUp, incremento: "+23% vs mes anterior" },
    { titulo: "Empresas Activas", valor: "34", icono: Building2, incremento: "+5% vs mes anterior" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-6 w-6 text-teal" />
            <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {metricas.map((metrica, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metrica.titulo}
                  </CardTitle>
                  <metrica.icono className="h-4 w-4 text-teal" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrica.valor}</div>
                  <p className="text-xs text-green-600">{metrica.incremento}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ventas Mensuales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ventasMensuales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="ventas" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportesIndex;
