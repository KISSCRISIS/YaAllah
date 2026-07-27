import { segTracks } from '@/lib/tracks';

export const registrationPlaceholderData = {
  brand: { name: 'SEG', tagline: 'Smart Emergency Guide' },
  intro: {
    heading: 'Create your SEG account',
    subheading: 'Join a clinical training platform built for emergency care teams.',
  },
  roles: segTracks.map((track) => ({ id: track.id, label: track.fullLabel })),
};
