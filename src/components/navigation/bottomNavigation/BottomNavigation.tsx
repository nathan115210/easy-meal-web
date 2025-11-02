'use client';

import styles from './bottomNavigation.module.scss';
import { NavigationItemPros } from '@/components/navigation/navigationTypes';
import Link from 'next/link';
import useIsActive from '@/utils/hooks/useIsActive';

export default function BottomNavigation({ items }: { items: NavigationItemPros[] }) {
  const isActiveItem = useIsActive();
  return (
    <nav className={styles.bottomNavigation}>
      <ul className={styles['bottomNavigation-list']}>
        {items.map((item, index: number) => {
          const isActive = isActiveItem(item.href);
          const itemClass = `${styles['bottomNavigation-list-item']} ${isActive ? styles.active : ''}`;

          return (
            <li key={index}>
              <Link href={item.href} className={itemClass}>
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
