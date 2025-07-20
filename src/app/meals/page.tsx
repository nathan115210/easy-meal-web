import React, { Suspense } from 'react';
import Grid, { GridItemProps } from '@/components/Grid/Grid';
import styles from './meals.module.scss';
import { Meal } from '@/types/meals';
import LoadingCardGrid from '@/components/LoadingCmponents/LoadingMainHeader/LoadingCardGrid/LoadingCardGrid';


async function fetchMeals(): Promise<Meal[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meals`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch meals');

  return res.json();
}

async function Meals() {
  const meals = await fetchMeals();
  console.log('meals', meals);
  const mealItems = extractMealItems(meals);

  return <Grid items={mealItems} heading="All Meals" enableFeatured={false} />;
}

export default async function MealsPage() {

  return <section className={styles.mealsPage}>
    <h1 className={styles.mealsHeading}>Our Meals</h1>
    <p className={styles.mealsDescription}>
      Discover delicious, healthy meals crafted for every lifestyle.
    </p>
    <Suspense fallback={<LoadingCardGrid />}>
      <Meals />
    </Suspense>
  </section>;
};


// helpers
const extractMealItems = (meals: Meal[]): GridItemProps[] => {
  if (!!meals.length) {
    return meals.map((meal) => ({
      id: meal.slug,
      title: meal.title,
      description: meal.description,
      imageUrl: meal.image,
      href: `/meals/${meal.slug}`,
    }));
  } else {
    return [] as GridItemProps[];
  }
};
