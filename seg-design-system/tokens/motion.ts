export const motion = {
  duration: {
    fast: '150ms',
    base: '300ms',
    slow: '400ms',
  },
  easing: { standard: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  allowed: ['hover', 'focus', 'loading', 'transition'] as const,
} as const;
