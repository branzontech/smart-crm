import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from 'uuid';
import { ColorPicker } from './ColorPicker';
import { ThemeCard } from './ThemeCard';
import { useTheme, Theme, ThemeColors } from '@/contexts/ThemeContext';
import { Paintbrush, Save, Palette, Brush } from 'lucide-react';

export const ThemeCustomizer: React.FC = () => {
  const { currentTheme, themes, setTheme, customizeTheme, addCustomTheme } = useTheme();
  
  const [customColors, setCustomColors] = useState<ThemeColors>({
    ...currentTheme.colors
  });
  
  const [useGradient, setUseGradient] = useState(currentTheme.type === 'gradient');
  const [customThemeName, setCustomThemeName] = useState("");

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));

    customizeTheme({ [colorKey]: value });
  };

  const saveCustomTheme = () => {
    if (!customThemeName.trim()) return;

    const newTheme: Theme = {
      id: uuidv4(),
      name: customThemeName,
      type: useGradient ? 'gradient' : 'solid',
      colors: customColors
    };

    addCustomTheme(newTheme);
    setCustomThemeName("");
  };

  const toggleThemeType = (checked: boolean) => {
    setUseGradient(checked);

    const type = checked ? 'gradient' : 'solid';
    const updatedColors = {
      ...customColors,
      ...(checked && !customColors.gradientStart ? { 
        gradientStart: '#ee9ca7', 
        gradientEnd: '#ffdde1' 
      } : {})
    };

    setCustomColors(updatedColors);
    customizeTheme(updatedColors);
  };

  return (
    <Tabs defaultValue="presets" className="space-y-4">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="presets" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Temas Predefinidos
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-2">
          <Paintbrush className="h-4 w-4" />
          Personalizar
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="presets" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === currentTheme.id}
              onClick={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Personalizar Colores</CardTitle>
            <CardDescription>
              Ajusta los colores del tema según tus preferencias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brush className="h-4 w-4" />
                <Label htmlFor="use-gradient">Usar Gradiente</Label>
              </div>
              <Switch
                id="use-gradient"
                checked={useGradient}
                onCheckedChange={toggleThemeType}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPicker
                label="Color Principal"
                value={customColors.primary}
                onChange={(value) => handleColorChange('primary', value)}
              />
              
              <ColorPicker
                label="Color Secundario"
                value={customColors.secondary}
                onChange={(value) => handleColorChange('secondary', value)}
              />
              
              <ColorPicker
                label="Color de Acento"
                value={customColors.accent}
                onChange={(value) => handleColorChange('accent', value)}
              />
              
              <ColorPicker
                label="Color de Fondo"
                value={customColors.background}
                onChange={(value) => handleColorChange('background', value)}
              />
              
              {useGradient && (
                <>
                  <ColorPicker
                    label="Inicio de Gradiente"
                    value={customColors.gradientStart || '#ee9ca7'}
                    onChange={(value) => handleColorChange('gradientStart', value)}
                  />
                  
                  <ColorPicker
                    label="Fin de Gradiente"
                    value={customColors.gradientEnd || '#ffdde1'}
                    onChange={(value) => handleColorChange('gradientEnd', value)}
                  />
                </>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="theme-name">Nombre del Tema</Label>
                <div className="flex space-x-2">
                  <Input
                    id="theme-name"
                    placeholder="Mi Tema Personalizado"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                  />
                  <Button onClick={saveCustomTheme} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Guardar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa</CardTitle>
            <CardDescription>
              Así es como se verán los componentes con este tema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Botón Primario</Button>
                <Button variant="secondary">Botón Secundario</Button>
                <Button variant="outline">Botón Outline</Button>
                <Button variant="ghost">Botón Ghost</Button>
              </div>
              
              {useGradient && customColors.gradientStart && customColors.gradientEnd && (
                <div 
                  className="h-20 rounded-md flex items-center justify-center text-white font-medium"
                  style={{ 
                    background: `linear-gradient(to right, ${customColors.gradientStart}, ${customColors.gradientEnd})` 
                  }}
                >
                  Efecto de Gradiente
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md p-4" style={{ backgroundColor: `hsl(${customColors.secondary})` }}>
                  <p className="font-medium">Panel Secundario</p>
                </div>
                <div className="rounded-md p-4" style={{ backgroundColor: `hsl(${customColors.accent})` }}>
                  <p className="font-medium">Panel de Acento</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
