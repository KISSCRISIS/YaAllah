'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ScreenLayout } from '../../layouts/ScreenLayout';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { Input } from '../../components/primitives/Input';
import { Badge } from '../../components/primitives/Badge';
import { IconPlaceholder } from '../../components/primitives/IconPlaceholder';
import { DrugCard } from '../../components/patterns/DrugCard';
import { Modal } from '../../components/patterns/Modal';
import { StatusIndicator } from '../../components/patterns/StatusIndicator';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { drugReferencePlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

export function DrugReference() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedDrug = data.drugs.find((d) => d.id === selectedId) ?? null;

  return (
    <ScreenLayout title="Drug Reference" description={data.header.subheading}>
      <GlassPanel elevated className="relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-3">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconPlaceholder label="Drug Reference" size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-seg-text-primary">{data.header.heading}</h2>
              <p className="text-sm text-seg-text-secondary">{data.header.subheading}</p>
            </div>
          </div>
          <Badge tone="primary">Personalized for {data.currentRoleContext}</Badge>
        </div>
      </GlassPanel>

      <GlassPanel className="col-span-1 flex flex-col gap-3 sm:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-2">
          <IconPlaceholder label="Search" />
          <Input placeholder="Search drug reference..." aria-label="Search drug reference" disabled className="flex-1" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-seg-text-secondary">{data.overview.totalDrugs} reference entries</p>
          <div className="flex flex-wrap gap-2">
            {data.overview.categories.map((c) => <Badge key={c} tone="neutral">{c}</Badge>)}
          </div>
        </div>
      </GlassPanel>

      {data.overview.categories.map((category) => {
        const categoryDrugs = data.drugs.filter((d) => d.category === category);
        if (categoryDrugs.length === 0) return null;
        return (
          <div key={category} className="col-span-1 flex flex-col gap-4 sm:col-span-2 lg:col-span-3">
            <h2 className="text-sm font-semibold text-seg-text-primary">{category}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryDrugs.map((d) => (
                <DrugCard key={d.id} name={d.name} category={d.category} status={d.status} statusLabel={d.statusLabel} onSelect={() => setSelectedId(d.id)} />
              ))}
            </div>
          </div>
        );
      })}

      {selectedDrug && (
        <Modal open={Boolean(selectedDrug)} onClose={() => setSelectedId(null)} titleId="drug-detail-title" title={selectedDrug.name}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge tone="neutral">{selectedDrug.category}</Badge>
              <StatusIndicator status={selectedDrug.status} label={selectedDrug.statusLabel} />
            </div>
            <p className="text-sm text-seg-text-secondary">{selectedDrug.description}</p>
            <p className="text-xs text-seg-text-secondary">Dosage, interactions, and clinical guidance: TBD — Requires Approval</p>
          </div>
        </Modal>
      )}
    </ScreenLayout>
  );
}
