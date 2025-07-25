'use client';

import styles from './main-header.module.scss';
import React from 'react';
import { usePathname } from 'next/navigation';
import Cta from '@/components/Cta/Cta';
import { CtaVariants } from '@/components/Cta/ctaType';

export interface NavLinkProps {
  href: string;
  label: string;
  ariaLabel: string;
  variant?: CtaVariants;
}

export default function NavLink({ href, label, ariaLabel, variant }: NavLinkProps) {
  const currentPath = usePathname();
  return (
    <Cta href={href} variant={variant || CtaVariants.Ghost} className={`${styles.navLink} ${currentPath === href ? styles['navLink_active'] : ''}`} aria-label={ariaLabel} hasIcon={false}>
      {label}
    </Cta>
  );
}
