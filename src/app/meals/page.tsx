import React, { Suspense } from 'react';
import styles from './meals.module.scss';
import LoadingCardGrid from '@/components/LoadingCmponents/LoadingMainHeader/LoadingCardGrid/LoadingCardGrid';
import MealsGridList from '@/app/meals/_components/MealsGridList';

export default async function MealsPage() {
  return (
    <section className={styles.mealsPage}>
      <h1 className={styles.mealsHeading}>Our Meals</h1>
      <p className={styles.mealsDescription}>Discover delicious, healthy meals crafted for every lifestyle.</p>
      <Suspense fallback={<LoadingCardGrid />}>
        <MealsGridList />
      </Suspense>
    </section>
  );
}
