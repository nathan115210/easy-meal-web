import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import { convertSlugToTitle } from '@/lib/utils/helpers';
import styles from './page.module.scss';

/*
type MealDetailsLayoutProps = PropsWithChildren<{
  params: Promise<{ mealSlug: string }>;
}>;
*/

export async function generateMetadata({ params }: { params: Promise<{ mealSlug: string }> }): Promise<Metadata> {
  const { mealSlug } = await params;
  const mealTitle = convertSlugToTitle(mealSlug);
  return {
    title: `Easy meal - ${mealTitle}`,
  };
}

export default async function MealDetailsLayout({
  children,
  recentViewed, //parallel route slot
}: {
  children: ReactNode;
  recentViewed: ReactNode;
}) {
  return (
    <article className={styles.mealDetail}>
      {children} {recentViewed}
    </article>
  );
}
