
import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ClausulaItem } from "./ClausulaItem";
import { SortableClausula } from "./SortableClausula";
import { LayoutDrop } from "./LayoutDrop";
import { ClausulaPreviewCard } from "./ClausulaPreviewCard";
import { clausulasDisponibles } from "@/data/clausulasContrato";
import { toast } from "sonner";
import { Clausula, Contrato } from "@/types/contrato";

interface ContratoBuilderProps {
  titulo: string;
  contratante: {
    nombre: string;
    identificacion: string;
    cargo?: string;
  };
  contratista: {
    nombre: string;
    identificacion: string;
  };
}

export const ContratoBuilder = ({ 
  titulo, 
  contratante,
  contratista
}: ContratoBuilderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [clausulasSeleccionadas, setClausulasSeleccionadas] = useState<Clausula[]>([
    {
      id: "identificacion-partes",
      titulo: "Identificación de las partes",
      tipo: "identificacion",
      contenido: "Entre los suscritos a saber, por una parte [NOMBRE EMPRESA], sociedad comercial identificada con NIT [...], representada legalmente por [REPRESENTANTE LEGAL] identificado con cédula de ciudadanía [...], quien en adelante se denominará EL CONTRATANTE, y por la otra, [NOMBRE CONTRATISTA], identificado con [DOCUMENTO IDENTIDAD] No. [...], quien para los efectos del presente contrato se denominará EL CONTRATISTA, se ha celebrado el contrato que se regirá por las siguientes cláusulas:",
      editable: true,
      requerido: true
    },
    {
      id: "objeto",
      titulo: "Objeto del Contrato", 
      tipo: "objeto",
      contenido: "EL CONTRATISTA se obliga a prestar al CONTRATANTE los servicios de [...], de acuerdo a las especificaciones técnicas descritas en la propuesta presentada, la cual forma parte integral del presente contrato.",
      editable: true,
      requerido: true
    }
  ]);
  
  // Efecto para actualizar las cláusulas con los datos de las partes
  useEffect(() => {
    if (contratante.nombre || contratista.nombre) {
      setClausulasSeleccionadas(clausulas => 
        clausulas.map(clausula => {
          let contenidoActualizado = clausula.contenido;
          
          // Reemplazar datos del contratante
          if (contratante.nombre) {
            contenidoActualizado = contenidoActualizado.replace(/\[NOMBRE EMPRESA\]/g, contratante.nombre);
          }
          if (contratante.identificacion) {
            contenidoActualizado = contenidoActualizado.replace(/\[NIT \[\.\.\.\]\]/g, `NIT ${contratante.identificacion}`);
            contenidoActualizado = contenidoActualizado.replace(/NIT \[\.\.\.\]/g, `NIT ${contratante.identificacion}`);
          }
          if (contratante.cargo) {
            contenidoActualizado = contenidoActualizado.replace(/\[REPRESENTANTE LEGAL\]/g, contratante.cargo);
          }
          
          // Reemplazar datos del contratista
          if (contratista.nombre) {
            contenidoActualizado = contenidoActualizado.replace(/\[NOMBRE CONTRATISTA\]/g, contratista.nombre);
          }
          if (contratista.identificacion) {
            contenidoActualizado = contenidoActualizado.replace(/\[DOCUMENTO IDENTIDAD\] No\. \[\.\.\.\]/g, `C.C. No. ${contratista.identificacion}`);
            contenidoActualizado = contenidoActualizado.replace(/\[DOCUMENTO IDENTIDAD\]/g, "C.C.");
            contenidoActualizado = contenidoActualizado.replace(/No\. \[\.\.\.\]/g, `No. ${contratista.identificacion}`);
          }
          
          return {
            ...clausula,
            contenido: contenidoActualizado
          };
        })
      );
    }
  }, [contratante, contratista]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Handle inicio del arrastre
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };
  
  // Handle fin del arrastre
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    if (active.id !== over.id) {
      setClausulasSeleccionadas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  // Agregar una cláusula desde la biblioteca
  const agregarClausula = (clausula: Clausula) => {
    // Generar un ID único para la nueva cláusula
    const newId = `${clausula.id}-${Date.now()}`;
    
    // Reemplazar placeholder con datos reales en la nueva cláusula
    let contenidoActualizado = clausula.contenido;
    
    // Reemplazar datos del contratante
    if (contratante.nombre) {
      contenidoActualizado = contenidoActualizado.replace(/\[NOMBRE EMPRESA\]/g, contratante.nombre);
    }
    if (contratante.identificacion) {
      contenidoActualizado = contenidoActualizado.replace(/\[NIT \[\.\.\.\]\]/g, `NIT ${contratante.identificacion}`);
      contenidoActualizado = contenidoActualizado.replace(/NIT \[\.\.\.\]/g, `NIT ${contratante.identificacion}`);
    }
    if (contratante.cargo) {
      contenidoActualizado = contenidoActualizado.replace(/\[REPRESENTANTE LEGAL\]/g, contratante.cargo);
    }
    
    // Reemplazar datos del contratista
    if (contratista.nombre) {
      contenidoActualizado = contenidoActualizado.replace(/\[NOMBRE CONTRATISTA\]/g, contratista.nombre);
    }
    if (contratista.identificacion) {
      contenidoActualizado = contenidoActualizado.replace(/\[DOCUMENTO IDENTIDAD\] No\. \[\.\.\.\]/g, `C.C. No. ${contratista.identificacion}`);
      contenidoActualizado = contenidoActualizado.replace(/\[DOCUMENTO IDENTIDAD\]/g, "C.C.");
      contenidoActualizado = contenidoActualizado.replace(/No\. \[\.\.\.\]/g, `No. ${contratista.identificacion}`);
    }
    
    // Verificar si ya existe una cláusula con el mismo tipo
    const existe = clausulasSeleccionadas.some((c) => c.tipo === clausula.tipo && clausula.tipo !== "otros");
    if (existe) {
      toast.info(`Ya existe una cláusula de tipo "${clausula.titulo}"`);
      return;
    }
    
    setClausulasSeleccionadas([...clausulasSeleccionadas, 
      {...clausula, id: newId, contenido: contenidoActualizado}
    ]);
    toast.success(`Cláusula "${clausula.titulo}" añadida`);
  };
  
  // Remover una cláusula
  const removerClausula = (id: string) => {
    // No permitir eliminar cláusulas requeridas
    const clausula = clausulasSeleccionadas.find(c => c.id === id);
    if (clausula?.requerido) {
      toast.error("No se puede eliminar una cláusula obligatoria");
      return;
    }
    
    setClausulasSeleccionadas(clausulasSeleccionadas.filter((c) => c.id !== id));
    toast.success("Cláusula eliminada");
  };
  
  // Actualizar contenido de una cláusula
  const actualizarClausula = (id: string, contenido: string) => {
    setClausulasSeleccionadas(
      clausulasSeleccionadas.map((c) => 
        c.id === id ? { ...c, contenido } : c
      )
    );
  };
  
  // Encontrar la cláusula activa
  const findClausula = (id: string) => {
    return clausulasSeleccionadas.find((c) => c.id === id) || 
           clausulasDisponibles.find((c) => c.id === id);
  };
  
  const activeClausula = activeId ? findClausula(activeId as string) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Panel de Cláusulas Disponibles */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Biblioteca de Cláusulas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 h-[calc(100vh-250px)] overflow-y-auto scrollbar-custom">
            {clausulasDisponibles.map((clausula) => (
              <ClausulaPreviewCard 
                key={clausula.id} 
                clausula={clausula} 
                onClick={() => agregarClausula(clausula)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
      
      {/* Área del Contrato */}
      <div className="md:col-span-2">
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="print:py-2">
            <CardTitle className="text-xl text-center">
              {titulo || "Vista Previa del Contrato"}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100vh-250px)] overflow-y-auto scrollbar-custom print:h-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={clausulasSeleccionadas.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4 relative min-h-[500px]">
                  {clausulasSeleccionadas.length === 0 ? (
                    <LayoutDrop mensaje="Arrastra cláusulas aquí para construir tu contrato" />
                  ) : (
                    clausulasSeleccionadas.map((clausula) => (
                      <SortableClausula 
                        key={clausula.id} 
                        clausula={clausula}
                        onUpdate={actualizarClausula}
                        onRemove={removerClausula}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
              
              <DragOverlay>
                {activeClausula ? (
                  <ClausulaItem clausula={activeClausula} isOverlay />
                ) : null}
              </DragOverlay>
            </DndContext>
            
            {/* Sección de firmas */}
            <div className="mt-12 grid grid-cols-2 gap-8 print:mt-8">
              <div className="border-t pt-4">
                <p className="text-center font-medium">CONTRATANTE</p>
                <p className="text-center mt-16">_________________________</p>
                <p className="text-center text-sm mt-2">{contratante.nombre || "[Nombre del Representante]"}</p>
                <p className="text-center text-sm">{contratante.cargo || "[Cargo]"}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-center font-medium">CONTRATISTA</p>
                <p className="text-center mt-16">_________________________</p>
                <p className="text-center text-sm mt-2">{contratista.nombre || "[Nombre del Contratista]"}</p>
                <p className="text-center text-sm">{contratista.identificacion ? `C.C. ${contratista.identificacion}` : "[Identificación]"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
