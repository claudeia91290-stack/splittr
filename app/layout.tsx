import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Splittr — À deux, c\'est moins cher',
  description: 'Profite des promos volume sans le risque. Achat groupé sécurisé entre particuliers.',
};

export const viewport: Viewport = {
  themeColor: '#0F1F3D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
