import { segTracks } from '@/lib/tracks';

type PracticeModuleStatus = 'available' | 'locked' | 'completed';

const currentTrack = segTracks.find((track) => track.id === 'ems_paramedic')!;

export const practicePlaceholderData: {
  header: { heading: string; subheading: string };
  currentRoleContext: string;
  overview: { availableModules: number; sessionsCompleted: number; averageProgress: number };
  quickCategories: string[];
  modules: { id: string; title: string; description: string; difficulty: string; status: PracticeModuleStatus }[];
} = {
  header: {
    heading: 'Clinical Practice Simulation',
    subheading: 'Apply your training in realistic emergency scenarios.',
  },
  currentRoleContext: currentTrack.shortLabel,
  overview: { availableModules: 5, sessionsCompleted: 2, averageProgress: 30 },
  quickCategories: ['Airway', 'Cardiac', 'Trauma', 'Pediatric'],
  modules: [
    { id: 'p1', title: 'Airway Management Scenario', description: 'Simulated airway obstruction response.', difficulty: 'Beginner', status: 'completed' },
    { id: 'p2', title: 'Cardiac Arrest Simulation', description: 'Practice recognizing and responding to cardiac arrest.', difficulty: 'Intermediate', status: 'available' },
    { id: 'p3', title: 'Multi-Casualty Triage', description: 'Practice triage decision-making in a multi-patient scenario.', difficulty: 'Advanced', status: 'locked' },
    { id: 'p4', title: 'Pediatric Emergency Simulation', description: 'Simulated pediatric emergency response.', difficulty: 'Intermediate', status: 'locked' },
  ],
};
