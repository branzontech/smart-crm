
import { Navbar } from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido al panel de administración. Selecciona una opción del menú
            para comenzar.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
