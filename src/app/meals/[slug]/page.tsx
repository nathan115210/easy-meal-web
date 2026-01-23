'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMealDataBySlug } from '@/utils/data-server/fetchMealDataBySlug';
import type { Meal } from '@/utils/types/meals';

type PageProps = { params: Promise<{ slug: string }> };

export default function MealDetailPage({ params }: PageProps) {
  const { slug } = React.use(params);

  const {
    data: mealData,
    isLoading,
    isError,
    error,
  } = useQuery<Meal | null>({
    queryKey: ['meal', slug],
    queryFn: ({ signal }) => fetchMealDataBySlug(slug, signal),
    enabled: Boolean(slug),
  });

  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!mealData) return <div>Not found</div>;
  console.log('mealData', mealData);
  return <div>{mealData.title}</div>;
}
