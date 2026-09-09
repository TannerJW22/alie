import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import './tool.css';

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Alie — Free professional tools', template: '%s | Alie' },
  description: 'Clear, free browser tools for everyday professional work.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
