'use client';

import styles from './bottomNavigation.module.scss';
import { NavigationItemPros } from '@/components/navigation/navigationTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation({ items }: { items: NavigationItemPros[] }) {
  const pathname = usePathname();

  return (
    <nav className={styles.bottomNavigation}>
      <ul className={styles['bottomNavigation-list']}>
        {items.map((item, index: number) => {
          const isActive = pathname === item.href;
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
