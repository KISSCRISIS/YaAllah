import type { Config } from 'tailwindcss';
import { segTailwindTokens } from './seg-design-system/styles/tailwind.config.tokens';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './seg-design-system/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '[data-seg-theme="dark"]'],
  theme: {
    extend: {
      ...(segTailwindTokens.extend ?? {}),
    },
  },
  plugins: [],
};

export default config;
