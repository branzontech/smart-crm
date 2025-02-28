
import { Navbar } from "@/components/layout/Navbar";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Datos para las gráficas
const actividadData = [
  { name: "Ene", ventas: 4000, visitas: 2400 },
  { name: "Feb", ventas: 3000, visitas: 1398 },
  { name: "Mar", ventas: 2000, visitas: 9800 },
  { name: "Abr", ventas: 2780, visitas: 3908 },
  { name: "May", ventas: 1890, visitas: 4800 },
  { name: "Jun", ventas: 2390, visitas: 3800 },
];

const estadoVentasData = [
  { name: "Pendientes", value: 30 },
  { name: "En proceso", value: 45 },
  { name: "Completadas", value: 25 },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316"];

const recaudosData = [
  { name: "Ene", value: 3500 },
  { name: "Feb", value: 2800 },
  { name: "Mar", value: 4200 },
  { name: "Abr", value: 3800 },
  { name: "May", value: 5100 },
  { name: "Jun", value: 4700 },
];

export default function Index() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Resumen general */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Actividad de ventas y visitas</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={actividadData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ventas"
                        stroke="#0EA5E9"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="visitas" stroke="#8B5CF6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Estado de ventas */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4">Estado de ventas</h2>
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={estadoVentasData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {estadoVentasData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráfica de recaudos */}
              <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                <h2 className="text-lg font-medium mb-4">Recaudos mensuales</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={recaudosData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Recaudos" fill="#1EAEDB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Información adicional */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium mb-2">Próximas Tareas</h2>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Reunión con cliente el 15/06
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Presentación de propuesta el 18/06
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Seguimiento de cotización el 20/06
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium mb-2">Actividad Reciente</h2>
                  <div className="space-y-3 text-gray-600">
                    <div className="border-l-2 border-blue-500 pl-3">
                      <p className="font-medium">Nueva cotización creada</p>
                      <p className="text-xs text-gray-500">Hace 2 horas</p>
                    </div>
                    <div className="border-l-2 border-green-500 pl-3">
                      <p className="font-medium">Cliente actualizado</p>
                      <p className="text-xs text-gray-500">Hace 3 horas</p>
                    </div>
                    <div className="border-l-2 border-purple-500 pl-3">
                      <p className="font-medium">Contrato firmado</p>
                      <p className="text-xs text-gray-500">Hace 1 día</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
