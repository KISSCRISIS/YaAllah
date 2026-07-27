type ModuleStatus = 'completed' | 'in-progress' | 'not-started';

export const learnPlaceholderData: {
  header: { heading: string; subheading: string };
  currentRoleContext: string;
  overview: { modulesCompleted: number; totalModules: number; overallProgress: number };
  modules: { id: string; title: string; description: string; category: string; progress: number; status: ModuleStatus }[];
  recommended: { id: string; title: string; meta: string }[];
} = {
  header: {
    heading: 'Clinical Education Center',
    subheading: 'Structured learning modules for emergency medicine practice.',
  },
  currentRoleContext: 'Paramedic',
  overview: { modulesCompleted: 4, totalModules: 9, overallProgress: 46 },
  modules: [
    { id: 'm1', title: 'Airway Management Fundamentals', description: 'Core techniques for airway control.', category: 'Core Emergency Skills', progress: 100, status: 'completed' },
    { id: 'm2', title: 'Cardiac Emergency Recognition', description: 'Identifying and responding to cardiac events.', category: 'Core Emergency Skills', progress: 100, status: 'completed' },
    { id: 'm3', title: 'Trauma Assessment Principles', description: 'Systematic trauma evaluation approach.', category: 'Core Emergency Skills', progress: 60, status: 'in-progress' },
    { id: 'm4', title: 'Pediatric Emergency Care', description: 'Emergency response considerations for pediatric patients.', category: 'Specialized Care', progress: 0, status: 'not-started' },
    { id: 'm5', title: 'Toxicology Basics', description: 'Recognizing and managing common toxic exposures.', category: 'Specialized Care', progress: 0, status: 'not-started' },
  ],
  recommended: [
    { id: 'r1', title: 'Advanced Airway Techniques', meta: 'Based on your recent activity' },
    { id: 'r2', title: 'Multi-Casualty Triage Principles', meta: 'Suggested next step' },
  ],
};
