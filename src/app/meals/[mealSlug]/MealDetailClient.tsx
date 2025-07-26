'use client';

import { Meal } from '@/types/meals';
import { useQuery } from '@tanstack/react-query';
import styles from './page.module.scss';
import Image from 'next/image';
import MealDetailSkeleton from '@/components/LoadingCmponents/LoadingMealDetails/LoadingMealDetails';
import { notFound } from 'next/navigation';
import React from 'react';

async function getMealBySlug(slug: string): Promise<Meal> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/meals/${slug}`);

  if (!res.ok) throw new Error(`Failed to fetch meal with slug: ${slug}`);
  const jsonData = await res.json();

  if (!jsonData.meal) throw new Error(`Meal with slug "${slug}" not found`);
  return jsonData.meal as Meal;
}

export default function MealDetailClient({ mealSlug }: { mealSlug: string }) {
  const {
    data: meal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meal', mealSlug],
    queryFn: () => getMealBySlug(mealSlug),
    staleTime: 1000 * 60 * 5, // 5 minutes freshness
    refetchOnWindowFocus: false,
    retry: false,
  });
  if (isLoading) return <MealDetailSkeleton />;
  if (error) {
    console.error('Error fetching meal:', error);
    notFound();

    return null;
  }
  if (!meal) return null;
  
  return (
    <>
      <div className={styles.imageHeaderRow}>
        <div className={styles.imageWrapper}>
          <Image src={meal.image} alt={meal.title} fill className={styles.image} />
        </div>

        <header className={styles.header}>
          <h1 className={styles.title}>{meal.title}</h1>
          <p className={styles.creator}>
            By <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <section className={styles.summary}>
            <p>{meal.description}</p>
          </section>
        </header>
      </div>

      <section className={styles.instructions}>
        <h2>Instructions</h2>
        <pre className={styles.pre}>{meal.instructions}</pre>
      </section>

      {/*TODO: add recommened meal*/}
    </>
  );
}
