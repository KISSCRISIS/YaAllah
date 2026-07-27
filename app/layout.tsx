import type { ReactNode } from 'react';
import { ThemeProvider } from '@/seg-design-system/theme/ThemeProvider';
import { DirectionProvider } from '@/seg-design-system/theme/DirectionProvider';
import '@/seg-design-system/styles/globals.css';

export const metadata = {
  title: 'SEG — Smart Emergency Guide',
  description: 'Emergency medicine training and reference platform.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <ThemeProvider>
          <DirectionProvider>{children}</DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
