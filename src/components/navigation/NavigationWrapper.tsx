'use client';

import React, { memo, ReactNode } from 'react';
import useMediaQuery from '@/utils/hooks/useMediaQuery';
import type { NavigationItemProps } from '@/components/navigation/navigationTypes';
import SideNavigationWrapper from '@/components/navigation/sideNavigation/SideNavigationWrapper';
import BottomNavigationWrapper from '@/components/navigation/bottomNavigation/BottomNavigationWrapper';

type Props = {
  mainNavItems: NavigationItemProps[];
  shortcutItems?: NavigationItemProps[];
  /** Optional neutral placeholder while viewport is unknown (first paint) */
  placeholder?: ReactNode;
};

const DESKTOP_QUERY = '(min-width: 1200px)';

function NavigationWrapper({ mainNavItems, shortcutItems, placeholder = null }: Props) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Avoid flashing the wrong skeleton before we know the viewport
  if (isDesktop === null) return <>{placeholder}</>;

  return isDesktop ? (
    <SideNavigationWrapper mainNavItems={mainNavItems} shortcutItems={shortcutItems} />
  ) : (
    <BottomNavigationWrapper items={mainNavItems} />
  );
}

export default memo(NavigationWrapper);
