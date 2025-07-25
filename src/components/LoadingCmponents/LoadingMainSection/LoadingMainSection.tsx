import styles from './loadingMainSection.module.scss';
import Skeleton from '@/components/Skeleton/Skeleton';
import React from 'react';
import LoadingCardGrid from '@/components/LoadingCmponents/LoadingMainHeader/LoadingCardGrid/LoadingCardGrid';

export default function LoadingMainSection() {
  return (
    <main className={styles['loading-main']}>
      {/* Hero banner */}
      {/*TODO: could considering to have heading, paragraphs and ctas in helo banner*/}
      <Skeleton variant="section" size="full" className={styles.hero} />

      {/* Grid of cards */}
      <LoadingCardGrid />
    </main>
  );
}
