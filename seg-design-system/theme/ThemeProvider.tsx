'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { colors, type ColorTheme } from '../tokens/colors';

type ThemeContextValue = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
  tokens: typeof colors.dark;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = 'seg-design-theme';

export function ThemeProvider({ children, defaultTheme = 'dark' }: { children: ReactNode; defaultTheme?: ColorTheme }) {
  const [theme, setThemeState] = useState<ColorTheme>(defaultTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ColorTheme | null;
    if (stored === 'dark' || stored === 'light') setThemeState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.segTheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
    tokens: colors[theme],
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useSegTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useSegTheme must be used within a ThemeProvider');
  return ctx;
}
