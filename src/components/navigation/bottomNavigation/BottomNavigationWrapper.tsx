'use client';

import React, { Suspense } from 'react';
import styles from './bottomNavigation.module.scss';
import type { NavigationItemProps } from '@/components/navigation/navigationTypes';
import dynamic from 'next/dynamic';
import BottomNavigationSkeleton from '@/components/navigation/bottomNavigation/BottomNavigationSkeleton';

const BottomNavigation = dynamic(
  () => import('@/components/navigation/bottomNavigation/BottomNavigation')
);

export default function BottomNavigationWrapper({ items }: { items: NavigationItemProps[] }) {
  return (
    <div className={styles.bottomNavigationWrapper}>
      <Suspense fallback={<BottomNavigationSkeleton />}>
        <BottomNavigation items={items} />
      </Suspense>
    </div>
  );
}
