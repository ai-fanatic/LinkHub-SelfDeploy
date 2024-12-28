import React, { createContext, useContext, useState, useEffect } from 'react';
import { getContrastTextColor } from '@/utils/theme';

type Theme = {
  name: string;
  gradient: string;
  gridColor: string;
  background: string;
  textColor: string;
  cardBackground: string;
};

const themes: Theme[] = [
  {
    name: "Default Dark",
    gradient: "linear-gradient(135deg, #1A1F2C 0%, #221F26 100%)",
    gridColor: "rgba(255, 255, 255, 0.05)",
    background: "#1A1F2C",
    textColor: "rgba(255, 255, 255, 0.95)",
    cardBackground: "rgba(255, 255, 255, 0.08)"
  },
  {
    name: "Ocean",
    gradient: "linear-gradient(to right, #243949 0%, #517fa4 100%)",
    gridColor: "rgba(255, 255, 255, 0.05)",
    background: "#243949",
    textColor: "rgba(255, 255, 255, 0.95)",
    cardBackground: "rgba(255, 255, 255, 0.08)"
  },
  {
    name: "Sunset",
    gradient: "linear-gradient(to right, #ee9ca7, #ffdde1)",
    gridColor: "rgba(0, 0, 0, 0.05)",
    background: "#ee9ca7",
    textColor: "rgba(0, 0, 0, 0.95)",
    cardBackground: "rgba(0, 0, 0, 0.08)"
  },
  {
    name: "Forest",
    gradient: "linear-gradient(90deg, hsla(139, 70%, 75%, 1) 0%, hsla(63, 90%, 76%, 1) 100%)",
    gridColor: "rgba(0, 0, 0, 0.1)",
    background: "hsla(139, 70%, 75%, 1)",
    textColor: "rgba(0, 0, 0, 0.9)",
    cardBackground: "rgba(0, 0, 0, 0.12)"
  }
].map(theme => ({
  ...theme,
  textColor: getContrastTextColor(theme.background)
}));

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-background', currentTheme.background);
    document.documentElement.style.setProperty('--theme-text-color', currentTheme.textColor);
    document.documentElement.style.setProperty('--theme-card-background', currentTheme.cardBackground);
  }, [currentTheme]);

  const value = {
    currentTheme,
    setTheme: setCurrentTheme,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
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