'use client';
import dynamic from 'next/dynamic';
import { ScreenLayout } from '../../layouts/ScreenLayout';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { ProgressBar } from '../../components/primitives/ProgressBar';
import { Badge } from '../../components/primitives/Badge';
import { IconPlaceholder } from '../../components/primitives/IconPlaceholder';
import { Timeline } from '../../components/patterns/Timeline';
import { ProtocolCard } from '../../components/patterns/ProtocolCard';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { pathwayPlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

export function Pathway() {
  return (
    <ScreenLayout title="Pathway" description={data.header.subheading}>
      <GlassPanel elevated className="relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-3">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconPlaceholder label="Pathway" size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-seg-text-primary">{data.header.heading}</h2>
              <p className="text-sm text-seg-text-secondary">{data.header.subheading}</p>
            </div>
          </div>
          <Badge tone="primary">Personalized for {data.currentRoleContext}</Badge>
        </div>
      </GlassPanel>

      <GlassPanel elevated className="col-span-1 flex flex-col gap-4 sm:col-span-2 lg:col-span-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-seg-text-primary">Overall Progress</h2>
          <div className="flex flex-wrap gap-2">
            {data.summary.map((s) => <Badge key={s.id} tone={s.tone}>{s.label}: {s.count}</Badge>)}
          </div>
        </div>
        <ProgressBar value={data.overallProgress} label="Pathway completion" />
      </GlassPanel>

      <div className="col-span-1 grid grid-cols-1 gap-4 sm:col-span-2 lg:col-span-3 lg:grid-cols-[2fr_1fr]">
        <GlassPanel>
          <h2 className="mb-4 text-sm font-semibold text-seg-text-primary">Clinical Learning Journey</h2>
          <Timeline items={data.timeline} />
        </GlassPanel>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-seg-text-primary">Protocols</h2>
          {data.protocols.map((p) => (
            <ProtocolCard key={p.id} title={p.title} progress={p.progress} status={p.status} />
          ))}
        </div>
      </div>
    </ScreenLayout>
  );
}
