
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
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">{clausula.titulo}</CardTitle>
          <Button size="sm" variant="ghost" onClick={onClick} className="text-teal hover:text-sage">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4">
        <p className="text-xs text-gray-500 line-clamp-2">
          {clausula.contenido}
        </p>
      </CardContent>
    </Card>
  );
};
