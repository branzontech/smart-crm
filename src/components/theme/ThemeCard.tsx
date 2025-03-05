
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

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
        "cursor-pointer transition-all hover:shadow-md",
        isActive && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="text-center mb-2 font-medium">{name}</div>
        
        <div className="w-full h-24 rounded-md overflow-hidden mb-3">
          {type === 'gradient' && colors.gradientStart && colors.gradientEnd ? (
            <div 
              className="w-full h-full"
              style={{ 
                background: `linear-gradient(to right, ${colors.gradientStart}, ${colors.gradientEnd})` 
              }}
            />
          ) : (
            <div 
              className="w-full h-full"
              style={{ backgroundColor }}
            >
              <div className="flex justify-center items-center h-full">
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accentColor }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          {isActive ? "Activo" : "Seleccionar"}
        </Button>
      </CardContent>
    </Card>
  );
};
