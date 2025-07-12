import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './main-header.module.scss';

export default function MainHeader() {
  return (
    <header className={styles.container}>
      <Link href="/" className={styles.logo} aria-label="Easy Meal Home">
        <Image src="/logo.svg" alt="Easy meal" width={160} height={60} priority />
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/meals" className={styles.navLink}>
          Meals
        </Link>
        <Link href="/community" className={styles.navLink}>
          Community
        </Link>
      </nav>
    </header>
  );
}
