import React from 'react';
import MealDetail from '@/app/meals/[mealSlug]/MealDetail';
import RecentViewRecorder from '@/app/meals/[mealSlug]/_components/RecentViewRecorder';
import { getAllMealSlugs } from '@/lib/data-server/meals';

export const revalidate = 300; // route-level ISR (safe even with per-fetch ISR)
export const dynamicParams = true; // allow fallback for new slugs after build

export async function generateStaticParams() {
  try {
    const slugs = await getAllMealSlugs();

    return slugs.map((slug) => ({ mealSlug: slug }));
  } catch {
    return [];
  }
}
export default async function MealDetailPage({ params }: { params: { mealSlug: string } }) {
  const { mealSlug } = await params;

  return (
    <>
      <MealDetail mealSlug={mealSlug} />
      {/*To record the recent view of the meal*/}
      <RecentViewRecorder mealSlug={mealSlug} />
    </>
  );
}
