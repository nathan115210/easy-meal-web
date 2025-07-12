import React from 'react';
import Cta from '@/components/Cta/Cta';
import { CtaVariants } from '@/components/Cta/ctaType';
import Image from 'next/image';
import Grid, { GridItemProps } from '../Grid/Grid';
import styles from './introSection.module.scss';

export default function IntroSection() {
  return (
    <section className={styles.introSection}>
      <h1 className={styles.introSection__heading}>Fuel Your Day with Easy Meal</h1>
      <div className={styles.introSection__container}>
        <div className={styles.introSection__image}>
          <Image src={'/bowl.png'} alt={'Fuel Your Day'} width={300} height={300} />
        </div>
        <div className={styles.introSection__content}>
          <p>Plan, cook, and shop effortlessly with personalized meal recommendations, a dynamic planner, and auto-generated lists.</p>
          <ul>
            <li>🔍 Smart Recipe Search</li>
            <li>🗓️ Weekly Planner & Reminders</li>
            <li>🛒 One-Click Shopping Lists</li>
            <li>⭐ Community Reviews & Tips</li>
          </ul>
          <Cta href="/meals/dummy-1" variant={CtaVariants.Primary}>
            Get Started
          </Cta>
        </div>
      </div>
      <Grid items={items} featuredId="planner" heading={'featured'} />
    </section>
  );
}

const items: GridItemProps[] = [
  {
    id: 'search',
    title: 'Smart Recipe Search',
    imageUrl: '/intro-image.png',
    description: 'Find recipes based on ingredients, cuisine, and dietary needs.',
    href: '/features/search',
  },
  {
    id: 'planner',
    title: 'Weekly Planner & Reminders',
    imageUrl: '/intro-image.png',
    description: 'Schedule your meals and get cooking reminders.',
    href: '/features/planner',
  },
  {
    id: 'shopping',
    title: 'One-Click Shopping Lists',
    imageUrl: '/intro-image.png',
    description: 'Generate a shopping list from your planned recipes.',
    href: '/features/shopping-list',
  },
  {
    id: 'community',
    title: 'Community Reviews & Tips',
    imageUrl: '/intro-image.png',
    description: 'Read and share tips with fellow home cooks.',
    href: '/features/community',
  },
];
