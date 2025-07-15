/*any error boundary in the App Router needs to be a Client Component so it can use the reset() callback (which is a client-side function).*/
'use client';

import React from 'react';
import styles from './meals.module.scss';
import Cta from '@/components/Cta/Cta';
import { CtaVariants } from '@/components/Cta/ctaType';

export default function MealsErrorPage() {
  return (
    <section className={styles['meals-error']}>
      <h1 className={styles['meals-error__title']}>
        Meal Loading Error
      </h1>
      <p className={styles['meals-error__description']}>
        We couldn&#39;t load the meals for this page. Please check your connection or try refreshing. You can also
        return to the Home page.
      </p>
      <Cta href="/" variant={CtaVariants.Ghost} className={styles['meals-error__button']}>
        Back to Meals
      </Cta>
    </section>
  );
}