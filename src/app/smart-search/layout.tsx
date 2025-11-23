import type { Metadata } from 'next';
import { ReactNode } from 'react';
import TopBar from '@/components/topBar/TopBar';

export const metadata: Metadata = {
  title: 'Easy meal | Smart Search',
  description:
    'Discover trending and personalized recipes fast. Filter by ingredients, dietary preferences, cook time and popularity to find the perfect meal.',
  keywords: [
    'smart search',
    'recipes',
    'meal planner',
    'trending recipes',
    'search recipes',
    'filter recipes',
    'healthy recipes',
    'quick meals',
    'dietary filters',
  ],
  alternates: { canonical: '/smart-search' },
  openGraph: {
    title: 'Smart Search | Meal Planner',
    description:
      'Discover trending and personalized recipes fast. Filter by ingredients, dietary preferences, cook time and popularity.',
    url: '/smart-search',
    siteName: 'Meal Planner',
    type: 'website',
    images: [
      {
        url: '/og/smart-search.png', // replace with real asset
        width: 1200,
        height: 630,
        alt: 'Smart Search results preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Search | Meal Planner',
    description:
      'Find trending and personalized recipes quickly — filter by ingredients, diet, cook time and popularity.',
    images: ['/og/smart-search.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

function SmartSearchLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  );
}

export default SmartSearchLayout;
