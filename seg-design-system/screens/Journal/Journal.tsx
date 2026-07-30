'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { BookOpen, FileText } from 'lucide-react';
import { ScreenLayout } from '../../layouts/ScreenLayout';
import { GlassPanel } from '../../components/primitives/GlassPanel';
import { Button } from '../../components/primitives/Button';
import { Badge } from '../../components/primitives/Badge';
import { Input } from '../../components/primitives/Input';
import { Icon } from '../../components/primitives/Icon';
import { StatCard } from '../../components/patterns/StatCard';
import { Timeline } from '../../components/patterns/Timeline';
import { EmptyState } from '../../components/patterns/EmptyState';
import { Modal } from '../../components/patterns/Modal';
import { HeroAtmosphereStatic } from '../../experience/3d/HeroAtmosphereStatic';
import { journalPlaceholderData as data } from './placeholder-data';

const HeroAtmosphere = dynamic(
  () => import('../../experience/3d/HeroAtmosphere').then((m) => m.HeroAtmosphere),
  { ssr: false, loading: () => <HeroAtmosphereStatic /> }
);

export function Journal() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <ScreenLayout
      title="Journal"
      description={data.header.subheading}
      actions={<Button variant="primary" onClick={() => setIsEditorOpen(true)}>New Entry</Button>}
    >
      <GlassPanel elevated className="relative col-span-1 overflow-hidden sm:col-span-2 lg:col-span-3">
        <HeroAtmosphere className="absolute inset-0" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Icon icon={BookOpen} aria-label="Journal" size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-seg-text-primary">{data.header.heading}</h2>
              <p className="text-sm text-seg-text-secondary">{data.header.subheading}</p>
            </div>
          </div>
          <Badge tone="primary">Personalized for {data.currentRoleContext}</Badge>
        </div>
      </GlassPanel>

      <StatCard label="Total entries" value={`${data.overview.totalEntries}`} iconLabel="Total entries" tone="primary" />
      <StatCard label="Entries this month" value={`${data.overview.entriesThisMonth}`} iconLabel="Entries this month" tone="primary" />

      <GlassPanel className="col-span-1 sm:col-span-2 lg:col-span-3">
        <h2 className="mb-4 text-sm font-semibold text-seg-text-primary">History</h2>
        <Timeline items={data.timeline} />
      </GlassPanel>

      <div className="col-span-1 flex flex-col gap-4 sm:col-span-2 lg:col-span-3">
        <h2 className="text-sm font-semibold text-seg-text-primary">Reflections</h2>
        {data.entries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.entries.map((e) => (
              <GlassPanel key={e.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Icon icon={FileText} aria-label="Journal entry" />
                  <p className="text-xs text-seg-text-secondary">{e.meta}</p>
                </div>
                <p className="text-sm font-semibold text-seg-text-primary">{e.title}</p>
                <p className="text-xs text-seg-text-secondary">{e.snippet}</p>
              </GlassPanel>
            ))}
          </div>
        ) : (
          <EmptyState
            iconLabel="No entries"
            title="No journal entries yet"
            description="Entries you create will appear here."
            action={<Button variant="outline" size="sm" onClick={() => setIsEditorOpen(true)}>New Entry</Button>}
          />
        )}
      </div>

      <Modal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        titleId="journal-editor-title"
        title="New Journal Entry"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled>Save Entry</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Title" placeholder="Entry title" />
          <div>
            <label htmlFor="journal-note-body" className="mb-1.5 block text-sm font-medium text-seg-text-primary">Notes</label>
            <textarea
              id="journal-note-body"
              rows={5}
              placeholder="Write your notes..."
              className="w-full rounded-seg-md border border-seg-border bg-seg-surface px-3 py-2 text-sm text-seg-text-primary placeholder:text-seg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seg-primary"
            />
          </div>
          <p className="text-xs text-seg-text-secondary">Saving, storage, and synchronization are not yet implemented.</p>
        </div>
      </Modal>
    </ScreenLayout>
  );
}
