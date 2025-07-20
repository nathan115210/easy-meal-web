import Skeleton from '@/components/Skeleton/Skeleton';
import styles from './LoadingMealDetails.module.scss';
import React from 'react';

export default function MealDetailSkeleton() {
  return (
    <div className={styles.mealdetail}>
      <div className={styles.imageWrapper}>
        <Skeleton variant="rect" size="xl" className={styles['mealdetail-image']} />

        <div className={styles.intro}>
          <Skeleton variant="text" size="xl" className={styles['mealdetail-title']} />
          <Skeleton variant="text" size="md" className={styles['mealdetail-desc']} />
          <Skeleton variant="text" size="sm" className={styles['mealdetail-desc']} />
        </div>
      </div>

      {/* Additional details section */}
      <div className={styles.instructions}>
        <Skeleton variant="section" size="xl" />
        <Skeleton variant="text" size="xl" />
        <Skeleton variant="text" size="lg" />
        <Skeleton variant="text" size="md" />
      </div>
    </div>
  );
}
