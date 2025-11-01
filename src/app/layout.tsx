import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@styles/globals.scss';
import layout_styles from './layout.module.scss';
import Navigation from '@/components/navigation/Navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Easy meal',
  description: 'Discover and share easy, delicious recipes for every meal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${layout_styles.root}`}>
        <div className={layout_styles.nav}>
          <Navigation />
        </div>
        <main className={layout_styles.main}>{children}</main>
      </body>
    </html>
  );
}
