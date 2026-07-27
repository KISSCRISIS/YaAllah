export const colors = {
  dark: {
    canvas: '#0B0F19',
    surface: 'rgba(30,41,59,0.7)',
    primary: '#0EA5E9',
    primaryStrong: '#0EA5E9',
    emergency: '#EF4444',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: 'rgba(148,163,184,0.16)',
    focusRing: '#38BDF8',
    warning: '#F59E0B',
    onPrimary: '#0B0F19',
    onEmergency: '#0B0F19',
  },
  light: {
    canvas: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#0284C7',
    primaryStrong: '#0369A1',
    emergency: '#DC2626',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: 'rgba(15,23,42,0.08)',
    focusRing: '#0284C7',
    warning: '#D97706',
    onPrimary: '#FFFFFF',
    onEmergency: '#FFFFFF',
  },
} as const;

export type ColorTheme = keyof typeof colors;
