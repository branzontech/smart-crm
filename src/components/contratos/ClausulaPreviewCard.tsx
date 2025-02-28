
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Clausula } from "@/types/contrato";

interface ClausulaPreviewCardProps {
  clausula: Clausula;
  onClick: () => void;
}

export const ClausulaPreviewCard = ({ 
  clausula, 
  onClick 
}: ClausulaPreviewCardProps) => {
  return (
    <Card className="hover:shadow-md border border-gray-200">
      <CardHeader className="py-2 px-3 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{clausula.titulo}</CardTitle>
          <Button 
            onClick={onClick} 
            size="sm" 
            variant="outline"
            className="h-8 bg-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-3">
        <p className="text-xs text-gray-600 line-clamp-2">
          {clausula.contenido}
        </p>
      </CardContent>
    </Card>
  );
};
