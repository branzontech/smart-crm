
import React, { useState } from "react";
import { CalendarioSubtarea } from "@/types/calendario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface SubtareaFormProps {
  onAgregar: (subtarea: Omit<CalendarioSubtarea, "id" | "tareaId">) => void;
}

export const SubtareaForm = ({ onAgregar }: SubtareaFormProps) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [formVisible, setFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titulo.trim()) return;
    
    let fechaCumplimiento = undefined;
    if (fecha) {
      fechaCumplimiento = new Date(fecha);
      if (hora) {
        const [hours, minutes] = hora.split(":").map(Number);
        fechaCumplimiento.setHours(hours, minutes);
      }
    }
    
    onAgregar({
      titulo,
      descripcion: descripcion || undefined,
      fechaCumplimiento,
      completada: false
    });
    
    // Limpiar formulario
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setHora("");
    setFormVisible(false);
  };

  if (!formVisible) {
    return (
      <Button
        onClick={() => setFormVisible(true)}
        variant="outline"
        className="w-full mt-2 text-primary border-dashed border-primary/50 hover:bg-primary/5"
      >
        <Plus className="mr-2 h-4 w-4" /> Agregar subtarea
      </Button>
    );
  }

  return (
    <div className="space-y-3 p-3 border rounded-md mt-2 bg-gray-50">
      <div>
        <Label htmlFor="titulo-subtarea">Título</Label>
        <Input
          id="titulo-subtarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1"
          placeholder="Título de la subtarea"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="descripcion-subtarea">Descripción (opcional)</Label>
        <Textarea
          id="descripcion-subtarea"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="mt-1"
          placeholder="Descripción"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="fecha-subtarea" className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Fecha
          </Label>
          <Input
            id="fecha-subtarea"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hora-subtarea" className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> Hora
          </Label>
          <Input
            id="hora-subtarea"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="mt-1"
            disabled={!fecha}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setFormVisible(false)}
        >
          Cancelar
        </Button>
        <Button type="button" onClick={handleSubmit}>Agregar</Button>
      </div>
    </div>
  );
};
