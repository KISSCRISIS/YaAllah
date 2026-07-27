import { cn } from '../../components/utils/cn';

export function HeroAtmosphereStatic({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className="absolute -top-24 start-1/4 h-72 w-72 rounded-seg-full bg-seg-primary/20" style={{ filter: 'blur(60px)' }} />
      <div className="absolute top-1/3 end-10 h-56 w-56 rounded-seg-full bg-seg-primary/10" style={{ filter: 'blur(50px)' }} />
      <div className="absolute bottom-0 start-10 h-64 w-64 rounded-seg-full bg-seg-primary/15" style={{ filter: 'blur(70px)' }} />
    </div>
  );
}
