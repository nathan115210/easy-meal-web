import styles from './loadingHeader.module.scss';
import Skeleton from '@/components/Skeleton/Skeleton';
import React from 'react';

export default function LoadingMainHeader() {
  return (
    <header className={styles['loading-header']}>
      {/* Logo */}
      <Skeleton variant="block" size="md" className={styles.logo} />

      {/* Nav links */}
      <nav className={styles.nav}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="text" size="sm" className={styles['nav-link']} />
        ))}
      </nav>

      {/* Action icons */}
      <div className={styles.actions}>
        <Skeleton variant="circle" size="md" />
        <Skeleton variant="circle" size="md" />
      </div>
    </header>
  );
}
