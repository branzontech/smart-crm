
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Clausula } from "@/types/contrato";
import { cn } from "@/lib/utils";

interface ClausulaItemProps {
  clausula: Clausula;
  onUpdate?: (id: string, contenido: string) => void;
  onRemove?: (id: string) => void;
  isOverlay?: boolean;
}

export const ClausulaItem = ({ 
  clausula, 
  onUpdate,
  onRemove,
  isOverlay = false
}: ClausulaItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contenido, setContenido] = useState(clausula.contenido);
  
  // Actualizar el contenido si cambia la cláusula externamente
  useEffect(() => {
    setContenido(clausula.contenido);
  }, [clausula.contenido]);
  
  const handleSave = () => {
    if (onUpdate) {
      onUpdate(clausula.id, contenido);
    }
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (onRemove) {
      onRemove(clausula.id);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-2 px-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{clausula.titulo}</CardTitle>
          {!isOverlay && (
            <div className="flex space-x-1">
              {!clausula.requerido && (
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              )}
              {clausula.editable && (
                <>
                  {isEditing ? (
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Guardar
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea 
              value={contenido} 
              onChange={(e) => setContenido(e.target.value)}
              className="min-h-[150px] w-full"
              placeholder="Ingrese el contenido de la cláusula"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setContenido(clausula.contenido);
                  setIsEditing(false);
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="default" 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm whitespace-pre-line">
            {contenido}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
