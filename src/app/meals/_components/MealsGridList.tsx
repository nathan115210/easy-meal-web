import Grid from '@/components/Grid/Grid';
import React from 'react';
import { getMeals } from '@/lib/data-server/meals';
import { extractMealItems } from '@/lib/utils/helpers';

export default async function MealsGridList() {
  const meals = await getMeals(); // ISR + tags
  const mealItems = extractMealItems(meals);
  return <Grid items={mealItems} heading="All Meals" enableFeatured={false} />;
}
