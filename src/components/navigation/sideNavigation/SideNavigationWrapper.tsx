'use client';

import React, { Suspense } from 'react';
import type { SideNavigationProps } from '@/components/navigation/sideNavigation/SideNavigation';
import styles from './sideNavigation.module.scss';
import dynamic from 'next/dynamic';
import SideNavigationSkeleton from '@/components/navigation/sideNavigation/SideNavigationSkeleton';

const SideNavigation = dynamic(
  () => import('@/components/navigation/sideNavigation/SideNavigation')
);

export default function SideNavigationWrapper({
  mainNavItems,
  shortcutItems,
}: SideNavigationProps) {
  return (
    <div className={styles.sideNavigationWrapper}>
      <Suspense fallback={<SideNavigationSkeleton />}>
        <SideNavigation mainNavItems={mainNavItems} shortcutItems={shortcutItems} />
      </Suspense>
    </div>
  );
}
