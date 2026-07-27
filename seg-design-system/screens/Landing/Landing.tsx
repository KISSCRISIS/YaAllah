'use client';
import dynamic from 'next/dynamic';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { IconPlaceholder } from '../../components/primitives/IconPlaceholder';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { landingPlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

export function Landing() {
  return (
    <div className="min-h-screen bg-seg-canvas text-seg-text-primary">
      <header className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-6 sm:px-6">
        <IconPlaceholder label="SEG logo" size="lg" />
        <div>
          <p className="text-sm font-semibold leading-none text-seg-text-primary">{data.brand.name}</p>
          <p className="text-xs text-seg-text-secondary">{data.brand.tagline}</p>
        </div>
      </header>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <HeroAtmosphere className="absolute inset-0" />
        <GlassPanel elevated padding="lg" className="relative mx-auto flex max-w-2xl flex-col items-start gap-4 text-start">
          <h1 className="text-3xl font-semibold text-seg-text-primary sm:text-4xl">{data.hero.heading}</h1>
          <p className="text-sm text-seg-text-secondary sm:text-base">{data.hero.subheading}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg">Get Started</Button>
            <Button variant="ghost" size="lg">Sign In</Button>
          </div>
        </GlassPanel>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <GlassPanel className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-seg-text-primary">Built for every emergency care role</h2>
          <div className="flex flex-wrap gap-2">
            {data.roles.map((r) => <Badge key={r.id} tone="neutral">{r.label}</Badge>)}
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
