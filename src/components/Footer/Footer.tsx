import React from 'react';
import Link from 'next/link';
import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__col}>
          <h4>About Easy Meal</h4>
          <p>Easy Meal helps you discover recipes, plan your week, and shop with ease. Built with home cooks in mind.</p>
        </div>

        <div className={styles.footer__col}>
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link href="/meals">All Recipes</Link>
            </li>
            <li>
              <Link href="/planner">Meal Planner</Link>
            </li>
            <li>
              <Link href="/shopping-list">Shopping List</Link>
            </li>
            <li>
              <Link href="/community">Community</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footer__col}>
          <h4>Contact</h4>
          <p>
            <a href="nathan_115210@hotmail.com">nathan_115210@hotmail.com</a>
          </p>
          <p>© {new Date().getFullYear()} Easy Meal</p>
        </div>
      </div>
    </footer>
  );
}
