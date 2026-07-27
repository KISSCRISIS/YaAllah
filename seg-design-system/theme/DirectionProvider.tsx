'use client';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Direction = 'ltr' | 'rtl';
export type Locale = 'en' | 'ar';
const LOCALE_DIRECTION: Record<Locale, Direction> = { en: 'ltr', ar: 'rtl' };

type DirectionContextValue = { direction: Direction; locale: Locale; setLocale: (l: Locale) => void };
const DirectionContext = createContext<DirectionContextValue | undefined>(undefined);

export function DirectionProvider({ children, defaultLocale = 'en' }: { children: ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const direction = LOCALE_DIRECTION[locale];

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  const value = useMemo(() => ({ direction, locale, setLocale }), [direction, locale]);
  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirection() {
  const ctx = useContext(DirectionContext);
  if (!ctx) throw new Error('useDirection must be used within a DirectionProvider');
  return ctx;
}
