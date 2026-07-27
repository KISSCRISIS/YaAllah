'use client';
import { useEffect, useState } from 'react';
import { cn } from '../../components/utils/cn';
import { usePrefersReducedMotion } from '../animations/usePrefersReducedMotion';
import { HeroAtmosphereStatic } from './HeroAtmosphereStatic';

export function HeroAtmosphere({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasEntered, setHasEntered] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const frame = requestAnimationFrame(() => setHasEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [prefersReducedMotion]);

  return (
    <div
      className={cn(
        'transition-[opacity,transform] duration-seg-slow ease-seg-standard',
        hasEntered ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className
      )}
    >
      <HeroAtmosphereStatic />
    </div>
  );
}
