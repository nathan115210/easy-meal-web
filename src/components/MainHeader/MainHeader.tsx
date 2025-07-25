import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './main-header.module.scss';
import { mainHeaderData } from '@/constants/mainHeaderData';
import NavLink from '@/components/MainHeader/NavLink';

export default function MainHeader() {
  const { logo, navLinks, navAriaLabel } = mainHeaderData;

  return (
    <header className={styles.container}>
      <Link href="/" className={styles.logo} aria-label={logo.alt}>
        <Image src={logo.imgSrc} alt="Easy meal" width={160} height={60} priority />
      </Link>
      <nav className={styles.nav} aria-label={navAriaLabel}>
        {navLinks.map((link, index) => {
          return <NavLink key={`${index}-${link.label}`} href={link.href} ariaLabel={link.ariaLabel} label={link.label} variant={link.variant} />;
        })}
      </nav>
    </header>
  );
}
