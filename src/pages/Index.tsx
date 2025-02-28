
import { Navbar } from "@/components/layout/Navbar";

export default function Index() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="main-container">
        <main className="flex-1 content-container">
          <div className="max-w-content">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Contenido del Dashboard */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-2">Bienvenido al CRM</h2>
                <p className="text-gray-600">
                  Administra tus clientes, ventas y más desde este panel.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-2">Actividad Reciente</h2>
                <p className="text-gray-600">
                  No hay actividad reciente para mostrar.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-2">Próximas Tareas</h2>
                <p className="text-gray-600">
                  No hay tareas programadas.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
