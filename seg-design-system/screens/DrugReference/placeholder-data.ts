type DrugStatus = 'available' | 'caution' | 'restricted';

export const drugReferencePlaceholderData: {
  header: { heading: string; subheading: string };
  currentRoleContext: string;
  overview: { totalDrugs: number; categories: string[] };
  drugs: { id: string; name: string; category: string; status: DrugStatus; statusLabel: string; description: string }[];
} = {
  header: {
    heading: 'Clinical Drug Reference',
    subheading: 'Quick access to emergency medication reference information.',
  },
  currentRoleContext: 'Paramedic',
  overview: { totalDrugs: 6, categories: ['Analgesics', 'Cardiac', 'Respiratory', 'Sedatives'] },
  drugs: [
    { id: 'd1', name: 'Epinephrine', category: 'Cardiac', status: 'available', statusLabel: 'Available', description: 'Placeholder description for Epinephrine.' },
    { id: 'd2', name: 'Morphine Sulfate', category: 'Analgesics', status: 'caution', statusLabel: 'Caution', description: 'Placeholder description for Morphine Sulfate.' },
    { id: 'd3', name: 'Albuterol', category: 'Respiratory', status: 'available', statusLabel: 'Available', description: 'Placeholder description for Albuterol.' },
    { id: 'd4', name: 'Midazolam', category: 'Sedatives', status: 'restricted', statusLabel: 'Restricted', description: 'Placeholder description for Midazolam.' },
    { id: 'd5', name: 'Aspirin', category: 'Cardiac', status: 'available', statusLabel: 'Available', description: 'Placeholder description for Aspirin.' },
    { id: 'd6', name: 'Naloxone', category: 'Analgesics', status: 'available', statusLabel: 'Available', description: 'Placeholder description for Naloxone.' },
  ],
};
