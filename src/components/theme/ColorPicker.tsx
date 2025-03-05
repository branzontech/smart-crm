
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presetColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = ['#285D66', '#6DA095', '#B7DBC8', '#E1DF66', '#E5DEFF', '#D3E4FD', '#FFDEE2', '#FDE1D3']
}) => {
  // Convert HSL string to hex for the input
  const hslToHex = (hsl: string): string => {
    // Simple conversion or return as is if it's already a hex
    if (hsl.startsWith('#')) return hsl;
    
    // For HSL values like "180 43% 28%"
    const parts = hsl.split(' ');
    if (parts.length !== 3) return '#285D66'; // Default if invalid

    const h = parseInt(parts[0]);
    const s = parseInt(parts[1]) / 100;
    const l = parseInt(parts[2]) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }
    
    r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  };

  // Convert hex to HSL for the theme system
  const hexToHsl = (hex: string): string => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      
      h = Math.round(h * 60);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
    }
    
    return `${h} ${s}% ${l}%`;
  };

  const handleChange = (hexColor: string) => {
    if (hexColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      const hslColor = hexToHsl(hexColor);
      onChange(hslColor);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={`color-${label}`}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left font-normal h-10" 
            id={`color-${label}`}
          >
            <div 
              className="h-4 w-4 rounded-full mr-2 border" 
              style={{
                background: value.startsWith('#') ? value : `hsl(${value})`
              }}
            />
            <span>{value.startsWith('#') ? value : `hsl(${value})`}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Input 
                  id={`hex-${label}`}
                  value={hslToHex(value)}
                  onChange={(e) => handleChange(e.target.value)}
                  className="h-8"
                />
                <div 
                  className="ml-2 h-8 w-8 rounded-md border" 
                  style={{
                    background: value.startsWith('#') ? value : `hsl(${value})`
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleChange(color)}
                  className={cn(
                    "h-6 w-6 rounded-md border",
                    hslToHex(value) === color && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
