import type { Config } from 'tailwindcss';

export const segTailwindTokens: Partial<Config['theme']> = {
  extend: {
    colors: {
      'seg-canvas': 'var(--seg-canvas)',
      'seg-surface': 'var(--seg-surface)',
      'seg-primary': 'var(--seg-primary)',
      'seg-primary-strong': 'var(--seg-primary-strong)',
      'seg-emergency': 'var(--seg-emergency)',
      'seg-text-primary': 'var(--seg-text-primary)',
      'seg-text-secondary': 'var(--seg-text-secondary)',
      'seg-border': 'var(--seg-border)',
      'seg-warning': 'var(--seg-warning)',
      'seg-on-primary': 'var(--seg-on-primary)',
      'seg-on-emergency': 'var(--seg-on-emergency)',
    },
    borderRadius: {
      'seg-sm': '6px',
      'seg-md': '10px',
      'seg-lg': '16px',
      'seg-xl': '24px',
      'seg-full': '9999px',
    },
    boxShadow: {
      'seg-sm': 'var(--seg-shadow-sm)',
      'seg-md': 'var(--seg-shadow-md)',
      'seg-lg': 'var(--seg-shadow-lg)',
    },
    backdropBlur: {
      'seg-glass': '12px',
    },
    transitionDuration: {
      'seg-fast': 'var(--seg-duration-fast)',
      'seg-base': 'var(--seg-duration-base)',
      'seg-slow': 'var(--seg-duration-slow)',
    },
    transitionTimingFunction: {
      'seg-standard': 'var(--seg-easing-standard)',
    },
    keyframes: {
      'seg-pulse': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
    },
    animation: {
      'seg-pulse': 'seg-pulse var(--seg-duration-slow) var(--seg-easing-standard) infinite',
    },
  },
};

// Merge segTailwindTokens.extend into the host SEG app's own
// tailwind.config.{js,ts} theme.extend when integrating later. This file is
// NOT wired into a live Tailwind config in this package.
