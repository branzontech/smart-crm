
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Check } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
  isActive: boolean;
  onClick: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onClick }) => {
  const { colors, name, type } = theme;
  
  // Preparar colores para visualización
  const primaryColor = `hsl(${colors.primary})`;
  const secondaryColor = `hsl(${colors.secondary})`;
  const accentColor = `hsl(${colors.accent})`;
  const backgroundColor = `hsl(${colors.background})`;
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md overflow-hidden",
        isActive ? "ring-2 ring-primary" : "ring-1 ring-border"
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div 
          className="w-full h-24 relative"
          style={{ 
            background: type === 'gradient' && colors.gradientStart && colors.gradientEnd 
              ? `linear-gradient(to right, ${colors.gradientStart}, ${colors.gradientEnd})` 
              : backgroundColor
          }}
        >
          {isActive && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
          
          {type !== 'gradient' && (
            <div className="flex justify-center items-center h-full">
              <div className="flex space-x-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accentColor }}></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3">
          <div className="text-center mb-2 font-medium">{name}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            {isActive ? "Activo" : "Seleccionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
