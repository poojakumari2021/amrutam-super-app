export const lightColors = {
  primary: '#3B5F45',
  primaryLight: '#5C7F63',
  secondary: '#C17F59',
  background: '#FAF7F2',
  surface: '#FFFFFF',
  text: '#2C2416',
  textSecondary: '#7A6F63',
  border: '#E8DFD4',
  error: '#C44536',
  success: '#4A7C59',
  warning: '#D4A017',
  overlay: 'rgba(44, 36, 22, 0.45)',
} as const;

export const darkColors = {
  primary: '#7BA887',
  primaryLight: '#9BC4A6',
  secondary: '#D4A574',
  background: '#1A1814',
  surface: '#262219',
  text: '#F5F0E8',
  textSecondary: '#A89B8C',
  border: '#3D362C',
  error: '#E57373',
  success: '#81C784',
  warning: '#FFD54F',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export type ColorScheme = typeof lightColors | typeof darkColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  /** Gap between major screen blocks (header → search → filters → list). */
  block: 16,
  /** Horizontal gap in grids and chip rows. */
  gutter: 16,
} as const;

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 21 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 17 },
  label: { fontSize: 14, fontWeight: '500' as const, lineHeight: 18 },
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 18,
  full: 999,
} as const;
