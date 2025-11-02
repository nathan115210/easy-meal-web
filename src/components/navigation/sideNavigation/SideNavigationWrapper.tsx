import React, { lazy, Suspense } from 'react';
import type { SideNavigationProps } from '@/components/navigation/sideNavigation/SideNavigation';
import styles from './sideNavigation.module.scss';
import SideNavigationSkeleton from '@/components/navigation/sideNavigation/SideNavigationSkeleton';

const SideNavigation = lazy(() => import('./SideNavigation'));

export default async function SideNavigationWrapper({
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
