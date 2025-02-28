
import { useState } from "react";
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
    <Card className={cn(
      "transition-shadow",
      isOverlay ? "shadow-md" : "shadow-sm",
      "print:shadow-none print:border-none"
    )}>
      <CardHeader className="py-3 px-4 print:py-1 print:px-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{clausula.titulo}</CardTitle>
          {!isOverlay && (
            <div className="flex space-x-2 print:hidden">
              {clausula.editable && (
                <>
                  {isEditing ? (
                    <Button size="sm" variant="ghost" onClick={handleSave}>
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
              {!clausula.requerido && (
                <Button size="sm" variant="ghost" onClick={handleDelete} className="text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 print:px-0">
        {isEditing ? (
          <Textarea 
            value={contenido} 
            onChange={(e) => setContenido(e.target.value)}
            className="min-h-[120px]"
          />
        ) : (
          <div className="text-sm whitespace-pre-line">{contenido}</div>
        )}
      </CardContent>
    </Card>
  );
};
