import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { secureStorage, STORAGE_KEYS } from '@/core/storage/storage';
import {
  borderRadius,
  darkColors,
  lightColors,
  spacing,
  typography,
  type ColorScheme,
} from '@/core/theme/tokens';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  colors: ColorScheme;
  spacing: typeof spacing;
  typography: typeof typography;
  borderRadius: typeof borderRadius;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const saved = secureStorage.getString(STORAGE_KEYS.theme) as ThemeMode | undefined;
    if (saved) {
      setModeState(saved);
    }
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    secureStorage.set(STORAGE_KEYS.theme, next);
  }, []);

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      mode,
      isDark,
      colors,
      spacing,
      typography,
      borderRadius,
      setMode,
    }),
    [mode, isDark, colors, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
