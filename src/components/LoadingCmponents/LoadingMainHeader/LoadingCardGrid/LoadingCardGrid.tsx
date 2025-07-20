import styles from './loadingCardGrid.module.scss';
import Skeleton from '@/components/Skeleton/Skeleton';
import React from 'react';

export default function LoadingCardGrid() {
  return (
    <div className={styles['loading-card-grid']}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <Skeleton variant="rect" size="xl" className={styles['card-image']} />
          <Skeleton variant="text" size="lg" className={styles['card-title']} />
          <Skeleton variant="text" size="md" className={styles['card-desc']} />
        </div>
      ))}
    </div>
  );
}