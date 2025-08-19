import React from 'react';
import MealDetailClient from '@/app/meals/[mealSlug]/MealDetailClient';
import RecentViewRecorder from '@/app/meals/[mealSlug]/RecentViewRecorder';

export default async function MealDetailPage({ params }: { params: { mealSlug: string } }) {
  const { mealSlug } = await params;

  return (
    <>
      <MealDetailClient mealSlug={mealSlug} />
      {/*To record the recent view of the meal*/}
      <RecentViewRecorder mealSlug={mealSlug} />
    </>
  );
}
