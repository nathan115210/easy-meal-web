import React from 'react';
import MealDetailClient from '@/app/meals/[mealSlug]/MealDetailClient';

export default async function MealDetailPage({ params }: { params: { mealSlug: string } }) {
  const { mealSlug } = params;

  return <MealDetailClient mealSlug={mealSlug} />;
}
