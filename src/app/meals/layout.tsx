import TopBar from '@/components/topBar/TopBar';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Easy meal | All Meals',
  description:
    'Browse all meals: healthy recipes with ingredients, prep time, and dietary filters.',
  keywords: ['meals', 'recipes', 'meal planning', 'healthy eating', 'diet'],
  alternates: { canonical: '/all-meals' },
  openGraph: {
    title: 'All Meals | Meal Planner',
    description: 'Discover every meal available in our recipe catalog.',
    url: '#TODOall-meals',
    type: 'website',
    images: [
      {
        url: '#TODO/og/all-meals.png',
        width: 1200,
        height: 630,
        alt: 'Meal gallery preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Meals | Meal Planner',
    description: 'Discover every meal available in our recipe catalog.',
    images: ['#TODO/og/all-meals.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MealsLayout({
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
