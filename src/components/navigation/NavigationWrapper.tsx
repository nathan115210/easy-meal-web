'use client';

import React, { memo, ReactNode } from 'react';
import useDeviceType from '@/utils/hooks/useMedieaQuery';
import type { NavigationItemPros } from '@/components/navigation/navigationTypes';
import SideNavigationWrapper from '@/components/navigation/sideNavigation/SideNavigationWrapper';
import BottomNavigationWrapper from '@/components/navigation/bottomNavigation/BottomNavigationWrapper';

type Props = {
  mainNavItems: NavigationItemPros[];
  shortcutItems?: NavigationItemPros[];
  /** Optional neutral placeholder while viewport is unknown (first paint) */
  placeholder?: ReactNode;
};

const DESKTOP_QUERY = '(min-width: 1200px)';

function NavigationWrapper({ mainNavItems, shortcutItems, placeholder = null }: Props) {
  const isDesktop = useDeviceType(DESKTOP_QUERY);

  // Avoid flashing the wrong skeleton before we know the viewport
  if (isDesktop === null) return <>{placeholder}</>;

  return isDesktop ? (
    <SideNavigationWrapper mainNavItems={mainNavItems} shortcutItems={shortcutItems} />
  ) : (
    <BottomNavigationWrapper items={mainNavItems} />
  );
}

export default memo(NavigationWrapper);
