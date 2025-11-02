import React, { lazy, Suspense } from 'react';
import styles from './bottomNavigation.module.scss';
import type { NavigationItemPros } from '@/components/navigation/navigationTypes';
import BottomNavigationSkeleton from '@/components/navigation/bottomNavigation/BottomNavigationSkeleton';

const BottomNavigation = lazy(() => import('./BottomNavigation'));

export default async function BottomNavigationWrapper({ items }: { items: NavigationItemPros[] }) {
  return (
    <div className={styles.bottomNavigationWrapper}>
      <Suspense fallback={<BottomNavigationSkeleton />}>
        <BottomNavigation items={items} />
      </Suspense>
    </div>
  );
}
