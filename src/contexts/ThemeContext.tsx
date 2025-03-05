
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradientStart?: string;
  gradientEnd?: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  type: 'solid' | 'gradient';
}

// Define our default themes
export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    type: 'solid',
    colors: {
      primary: '180 43% 28%', // teal
      secondary: '210 40% 96.1%',
      accent: '210 40% 96.1%',
      background: '0 0% 100%'
    }
  },
  {
    id: 'navy',
    name: 'Navy',
    type: 'solid',
    colors: {
      primary: '220 70% 30%', // navy blue
      secondary: '220 30% 90%',
      accent: '220 60% 50%',
      background: '220 20% 97%'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    type: 'solid',
    colors: {
      primary: '150 40% 30%', // forest green
      secondary: '150 30% 92%',
      accent: '150 40% 40%',
      background: '150 20% 97%'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    type: 'gradient',
    colors: {
      primary: '25 100% 50%', // orange
      secondary: '45 100% 50%',
      accent: '15 80% 50%',
      background: '0 0% 100%',
      gradientStart: '#ee9ca7',
      gradientEnd: '#ffdde1'
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  customizeTheme: (colors: Partial<ThemeColors>) => void;
  addCustomTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(DEFAULT_THEMES);
  const [currentTheme, setCurrentTheme] = useState<Theme>(DEFAULT_THEMES[0]);

  // Effect to load saved theme on component mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('crm-theme-id');
    if (savedThemeId) {
      const savedTheme = themes.find(t => t.id === savedThemeId);
      if (savedTheme) {
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
      }
    } else {
      applyTheme(currentTheme);
    }
  }, []);

  // Apply theme colors to CSS variables
  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Set primary color and calculate hover variant
    root.style.setProperty('--primary', theme.colors.primary);
    
    // For hover effect, we darken the primary color by adjusting the lightness
    const primaryParts = theme.colors.primary.split(' ');
    if (primaryParts.length === 3) {
      const h = primaryParts[0];
      const s = primaryParts[1];
      const l = parseInt(primaryParts[2]);
      root.style.setProperty('--primary-hover', `${h} ${s} ${Math.max(l - 6, 0)}%`); 
    }
    
    // Set other colors
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    
    // For foreground, we use a contrasting color based on background lightness
    const bgParts = theme.colors.background.split(' ');
    if (bgParts.length === 3) {
      const bgLightness = parseInt(bgParts[2]);
      if (bgLightness > 50) {
        root.style.setProperty('--foreground', '240 10% 3.9%'); // dark text on light bg
      } else {
        root.style.setProperty('--foreground', '0 0% 98%'); // light text on dark bg
      }
    }
    
    // Set gradient colors if present
    if (theme.type === 'gradient' && theme.colors.gradientStart && theme.colors.gradientEnd) {
      root.style.setProperty('--gradient-start', theme.colors.gradientStart);
      root.style.setProperty('--gradient-end', theme.colors.gradientEnd);
    }
  };

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('crm-theme-id', themeId);
    }
  };

  const customizeTheme = (colors: Partial<ThemeColors>) => {
    const updatedTheme = {
      ...currentTheme,
      colors: { ...currentTheme.colors, ...colors }
    };
    
    setCurrentTheme(updatedTheme);
    applyTheme(updatedTheme);
    
    // Update in themes array if it's a saved theme
    const updatedThemes = themes.map(t => 
      t.id === currentTheme.id ? updatedTheme : t
    );
    
    setThemes(updatedThemes);
    localStorage.setItem('crm-theme-id', currentTheme.id);
    localStorage.setItem('crm-themes', JSON.stringify(updatedThemes));
  };

  const addCustomTheme = (theme: Theme) => {
    const newThemes = [...themes, theme];
    setThemes(newThemes);
    setCurrentTheme(theme);
    applyTheme(theme);
    localStorage.setItem('crm-theme-id', theme.id);
    localStorage.setItem('crm-themes', JSON.stringify(newThemes));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, setTheme, customizeTheme, addCustomTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
