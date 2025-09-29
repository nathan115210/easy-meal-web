import React, { Suspense } from 'react';
import Grid from '@/components/Grid/Grid';
import styles from './meals.module.scss';
import { Meal } from '@/types/meals';
import LoadingCardGrid from '@/components/LoadingCmponents/LoadingMainHeader/LoadingCardGrid/LoadingCardGrid';
import { extractMealItems } from '@/lib/utils/helpers';

async function fetchMeals(): Promise<Meal[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meals`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch meals');

  return res.json();
}

export default async function MealsPage() {
  const meals = await fetchMeals();
  const mealItems = extractMealItems(meals);

  return (
    <section className={styles.mealsPage}>
      <h1 className={styles.mealsHeading}>Our Meals</h1>
      <p className={styles.mealsDescription}>Discover delicious, healthy meals crafted for every lifestyle.</p>
      <Suspense fallback={<LoadingCardGrid />}>
        <Grid items={mealItems} heading="All Meals" enableFeatured={false} />
      </Suspense>
    </section>
  );
}
