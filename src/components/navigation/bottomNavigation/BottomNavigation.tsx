'use client';

import styles from './bottomNavigation.module.scss';
import { NavigationItemProps } from '@/components/navigation/navigationTypes';
import Link from 'next/link';
import useIsActive from '@/utils/hooks/useIsActive';
import { memo } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import useMediaQuery from '@/utils/hooks/useMediaQuery';
import { deviceMediaQueries } from '@/utils/constants/mediaQuery';

function BottomNavigation({ items }: { items: NavigationItemProps[] }) {
  const isActiveItem = useIsActive();
  const isDesktop = useMediaQuery(deviceMediaQueries.desktop);
  if (isDesktop) return null;

  return (
    <nav className={styles.bottomNavigation}>
      <ul className={styles['bottomNavigation-list']}>
        {items.map((item, index: number) => {
          const isActive = isActiveItem(item.href);
          const itemClass = `${styles['bottomNavigation-list-item']} ${isActive ? styles.active : ''}`;

          return (
            <li key={index}>
              <Link href={item.href} className={itemClass}>
                <DynamicIcon name={item.icon} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default memo(BottomNavigation);
