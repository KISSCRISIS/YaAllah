import { segTracks } from '@/lib/tracks';

export const landingPlaceholderData = {
  brand: { name: 'SEG', tagline: 'Smart Emergency Guide' },
  hero: {
    heading: 'Emergency medicine training, elevated.',
    subheading: 'A clinical learning and practice platform for emergency care teams.',
  },
  roles: segTracks.map((track) => ({ id: track.id, label: track.fullLabel })),
};
