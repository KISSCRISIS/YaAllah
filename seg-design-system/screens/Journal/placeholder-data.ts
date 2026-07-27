type TimelineState = 'completed' | 'current' | 'upcoming';

export const journalPlaceholderData: {
  header: { heading: string; subheading: string };
  currentRoleContext: string;
  overview: { totalEntries: number; entriesThisMonth: number };
  timeline: { id: string; title: string; meta: string; state: TimelineState }[];
  entries: { id: string; title: string; meta: string; snippet: string }[];
} = {
  header: {
    heading: 'Professional Reflection Journal',
    subheading: 'Document your clinical learning and professional growth.',
  },
  currentRoleContext: 'Paramedic',
  overview: { totalEntries: 3, entriesThisMonth: 2 },
  timeline: [
    { id: 'j1', title: 'Reflected on Trauma Assessment Protocol', meta: 'Jul 20, 2026', state: 'completed' },
    { id: 'j2', title: 'Logged Practice Session Notes', meta: 'Jul 22, 2026', state: 'completed' },
    { id: 'j3', title: 'Drafted Pathway Progress Summary', meta: 'Jul 25, 2026', state: 'current' },
  ],
  entries: [
    { id: 'e1', title: 'Reflected on Trauma Assessment Protocol', meta: 'Jul 20, 2026', snippet: 'Notes on applying systematic trauma evaluation during the session.' },
    { id: 'e2', title: 'Logged Practice Session Notes', meta: 'Jul 22, 2026', snippet: 'Observations from the cardiac arrest simulation scenario.' },
    { id: 'e3', title: 'Drafted Pathway Progress Summary', meta: 'Jul 25, 2026', snippet: 'Summary of progress through the emergency training pathway.' },
  ],
};
