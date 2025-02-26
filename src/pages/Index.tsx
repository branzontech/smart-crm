
import { Navbar } from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          <p className="text-gray-600">
            Bienvenido a tu CRM. Gestiona tus clientes, ventas y relaciones comerciales
            desde un solo lugar.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
