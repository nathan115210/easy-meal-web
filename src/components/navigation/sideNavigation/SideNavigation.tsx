'use client';

import styles from './sideNavigation.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationItemPros } from '@/components/navigation/navigationTypes';
import { memo } from 'react';
import useIsActive from '@/utils/hooks/useIsActive';
import { DynamicIcon } from 'lucide-react/dynamic';
import useDeviceType from '@/utils/hooks/useMedieaQuery';
import { deviceMediaQueries } from '@/utils/constants';

export interface SideNavigationProps {
  mainNavItems: NavigationItemPros[];
  shortcutItems?: NavigationItemPros[];
}

function SideNavigation({ mainNavItems, shortcutItems }: SideNavigationProps) {
  const isActiveItem = useIsActive();
  const isDesktop = useDeviceType(deviceMediaQueries.desktop);
  if (!isDesktop) return null;

  return (
    <aside className={styles.sideNavigation}>
      <Link href={'/'} className={styles.logo}>
        <Image src="/logo.svg" alt="Your brand" width={120} height={70} priority />
      </Link>
      <ul className={styles.navigationList}>
        {mainNavItems.map((item, index) => {
          const isActive = isActiveItem(item.href);

          const itemClass = `${styles.navigationListItem} ${isActive ? styles.active : ''}`;
          return (
            <li key={index}>
              <Link href={item.href} className={itemClass}>
                <DynamicIcon name={item.icon} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      {!!shortcutItems?.length && (
        <div className={styles.shortcutSection}>
          <h2>Shortcuts</h2>
          <ul className={styles.navigationList}>
            {shortcutItems.map((item, index) => {
              const isActive = isActiveItem(item.href);

              const itemClass = `${styles.navigationListItem} ${isActive ? styles.active : ''}`;
              return (
                <li key={index}>
                  <Link href={item.href} className={itemClass}>
                    <DynamicIcon name={item.icon} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default memo(SideNavigation);
