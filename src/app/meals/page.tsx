import React from 'react';
import Grid, { GridItemProps } from '@/components/Grid/Grid';
import styles from './meals.module.scss';
import { Meal } from '@/types/meals';
import Cta from '@/components/Cta/Cta';


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

  if (!!mealItems.length) {
    return (
      <section className={styles.mealsPage}>
        <h1 className={styles.mealsHeading}>Our Meals</h1>
        <p className={styles.mealsDescription}>
          Discover delicious, healthy meals crafted for every lifestyle.
        </p>
        <Grid items={mealItems} heading="All Meals" enableFeatured={false} />
      </section>
    );
  } else {
    return (
      <section className={styles.mealsPage}>
        <h1 className={styles.mealsHeading}>Our Meals</h1>
        <p className={styles.mealsDescription}>
          No meals found. Please check back later.
        </p>
        <Cta href={'/'}>Back to home page</Cta>
      </section>
    );
  }
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
