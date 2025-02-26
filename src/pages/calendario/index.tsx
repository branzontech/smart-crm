
import { Navbar } from "@/components/layout/Navbar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const CalendarioIndex = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const eventos = [
    { fecha: "2024-03-15", titulo: "Reunión con Tech Solutions", tipo: "Reunión" },
    { fecha: "2024-03-20", titulo: "Presentación Green Energy", tipo: "Presentación" },
    { fecha: "2024-03-25", titulo: "Seguimiento Global Logistics", tipo: "Seguimiento" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="h-6 w-6 text-teal" />
            <h1 className="text-2xl font-semibold text-gray-900">Calendario</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </Card>

            <Card className="md:col-span-2 p-6">
              <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
              <div className="space-y-4">
                {eventos.map((evento, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{evento.titulo}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(evento.fecha).toLocaleDateString()} - {evento.tipo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarioIndex;
