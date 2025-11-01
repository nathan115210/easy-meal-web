'use client';

import styles from './sideNavigation.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import {NavigationItemPros} from '@/components/navigation/navigationTypes';
import {usePathname} from 'next/navigation';

export default function SideNavigation({
  mainNavItems,
  shortcutItems,
}: {
  mainNavItems: NavigationItemPros[];
  shortcutItems?: NavigationItemPros[];
}) {
  const pathname = usePathname();

  return (
    <aside className={styles.sideNavigation}>
      <Link href={'/'} className={styles.logo}>
        <Image src="/logo.svg" alt="Your brand" width={120} height={70} priority />
      </Link>
      <ul className={styles.navigationList}>
        {mainNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          const itemClass = `${styles.navigationListItem} ${isActive ? styles.active : ''}`;
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
      {!!shortcutItems?.length && (
        <div className={styles.shortcutSection}>
          <h2>Shortcuts</h2>
          <ul className={styles.navigationList}>
            {shortcutItems.map((item, index) => {
              const isActive = pathname === item.href;
              const itemClass = `${styles.navigationListItem} ${isActive ? styles.active : ''}`;
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
        </div>
      )}
    </aside>
  );
}
