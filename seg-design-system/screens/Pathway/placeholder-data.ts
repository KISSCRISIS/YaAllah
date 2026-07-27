type ProtocolStatus = 'not-started' | 'in-progress' | 'completed';
type TimelineState = 'completed' | 'current' | 'upcoming';
type BadgeTone = 'primary' | 'warning' | 'neutral';

export const pathwayPlaceholderData: {
  header: { heading: string; subheading: string };
  currentRoleContext: string;
  overallProgress: number;
  summary: { id: string; label: string; count: number; tone: BadgeTone }[];
  timeline: { id: string; title: string; meta: string; state: TimelineState }[];
  protocols: { id: string; title: string; progress: number; status: ProtocolStatus }[];
} = {
  header: {
    heading: 'Clinical Learning Pathway',
    subheading: 'Progress through structured emergency medicine protocols.',
  },
  currentRoleContext: 'Paramedic',
  overallProgress: 48,
  summary: [
    { id: 'completed', label: 'Completed', count: 2, tone: 'primary' },
    { id: 'in-progress', label: 'In Progress', count: 1, tone: 'warning' },
    { id: 'upcoming', label: 'Upcoming', count: 2, tone: 'neutral' },
  ],
  timeline: [
    { id: 't1', title: 'Airway Management Basics', meta: 'Completed', state: 'completed' },
    { id: 't2', title: 'Cardiac Arrest Response', meta: 'Completed', state: 'completed' },
    { id: 't3', title: 'Trauma Assessment Protocol', meta: 'In progress', state: 'current' },
    { id: 't4', title: 'Pediatric Emergency Care', meta: 'Upcoming', state: 'upcoming' },
    { id: 't5', title: 'Advanced Airway Techniques', meta: 'Upcoming', state: 'upcoming' },
  ],
  protocols: [
    { id: 'p1', title: 'Airway Management Basics', progress: 100, status: 'completed' },
    { id: 'p2', title: 'Cardiac Arrest Response', progress: 100, status: 'completed' },
    { id: 'p3', title: 'Trauma Assessment Protocol', progress: 55, status: 'in-progress' },
    { id: 'p4', title: 'Pediatric Emergency Care', progress: 0, status: 'not-started' },
  ],
};
