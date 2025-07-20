import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@styles/global.scss';
import MainHeader from '../components/MainHeader/MainHeader';
import Footer from '@/components/Footer/Footer';
import React, { Suspense } from 'react';
import LoadingMainHeader from '@/components/LoadingCmponents/LoadingMainHeader/LoadingMainHeader';
import { Providers } from './Providers';

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} 
            ${geistMono.variable}`}
      >
        <Providers>
          {/*TODO: this suspense will only work when header suspense. For example when getting user data from api / local*/}
          <Suspense fallback={<LoadingMainHeader />}>
            <MainHeader />
          </Suspense>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
