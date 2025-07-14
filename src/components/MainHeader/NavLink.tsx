'use client';

import styles from './main-header.module.scss';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

export interface NavLinkProps {
  href: string;
  label: string;
  ariaLabel: string;
}

export default function NavLink({ href, label, ariaLabel }: NavLinkProps) {
  const currentPath = usePathname();
  return (
    <Link href={href} className={`${styles.navLink} ${currentPath === href ? styles['navLink_active'] : ''}`} aria-label={ariaLabel}>
      {label}
    </Link>
  );
}
