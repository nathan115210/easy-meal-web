import React from 'react';
import styles from './page.module.scss';
import Cta from '@/components/Cta/Cta';

export default function NotFoundPage() {
  return (
    <div className={styles['not-found']}>
      <div className={styles['not-found__card']}>
        <h1 className={styles['not-found__heading']}>404</h1>
        <p className={styles['not-found__message']}>Sorry, the page you are looking for does not exist.</p>
        <Cta href="/" className={styles['not-found__cta']}>
          Go Home
        </Cta>
      </div>
    </div>
  );
}