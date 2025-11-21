'use client';

import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { MealsListItem } from '@/app/meals/page';
import { Col } from '@/components/grid/Grid';
import styles from '../page.module.scss';
import Card from '@/components/card/Card';
import BaseLink from '@/components/baseLink/BaseLink';
import { ALL_MEALS_QUERY } from '@/utils/lib/graphql/queries/meals-queries';
import { graphqlFetchClient } from '@/utils/data-server/graphqlFetchClient';
import Spinner from '@/components/spinner/Spinner';
import BottomLine from '@/components/bottomLine/BottomLine';
import EmptyList from '@/app/meals/components/EmptyList';
import CardsListSkeleton from '@/components/skeleton/cardsListSkeleton/CardsListSkeleton';

type MealsInfiniteListProps = {
  search?: string;
  category?: string;
};

type MealsPagePayload = {
  meals: {
    items: MealsListItem[];
    total: number;
    hasMore: boolean;
  };
};

const PAGE_SIZE = 8;

/**
 * Fetch a page of meals using the GraphQL client.
 * - Uses TanStack Query's AbortSignal to support cancellation.
 */
async function fetchMealsData({
  pageParam,
  search,
  category,
  signal,
}: {
  pageParam?: number;
  search?: string;
  category?: string;
  signal: AbortSignal;
}): Promise<MealsPagePayload['meals']> {
  const data = await graphqlFetchClient<MealsPagePayload>(
    ALL_MEALS_QUERY,
    {
      search,
      category,
      limit: PAGE_SIZE,
      offset: pageParam ?? 0,
    },
    signal
  );

  return data.meals;
}

export default function MealsInfiniteList({ search, category }: MealsInfiniteListProps) {
  const watcherRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, status } = useInfiniteQuery({
    queryKey: ['meals', search, category],

    queryFn: ({ pageParam = 0, signal }) =>
      fetchMealsData({
        pageParam,
        search,
        category,
        signal,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;

      // Next offset = number of items already loaded across all pages
      return allPages.reduce((sum, page) => sum + page.items.length, 0);
    },

    //control "stale-while-revalidate" behavior
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // don't refetch when tab gains focus
    refetchOnReconnect: true, // okay to refetch if user was offline
    refetchOnMount: false, // when remounting, just use cache if it's there

    retry: (failureCount, error) => {
      // Don't retry if the request was aborted (user scrolled quickly)
      if (error instanceof DOMException && error.name === 'AbortError') {
        return false;
      }

      // Retry at most 2 times
      return failureCount < 2;
    },

    retryDelay: (attemptIndex) => {
      // exponential backoff
      return Math.min(2000 * 2 ** attemptIndex, 8000);
    },
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  // IntersectionObserver to trigger fetching the next page
  useEffect(() => {
    if (!hasNextPage || !watcherRef.current) return;

    const node = watcherRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Initial load state
  if (status === 'pending') {
    return <CardsListSkeleton />;
  }

  // Error state
  if (status === 'error') {
    return (
      <div className={styles.loader}>
        <span>Something went wrong.</span>
        <pre className={styles.error}>{(error as Error).message}</pre>
      </div>
    );
  }

  // No data at all
  if (!items.length) return <EmptyList search={search} category={category} />;

  const bottomLineText = !!search || !!category ? '🔍 That’s all we found' : '🍽️  All meals loaded';

  return (
    <>
      {items.map((meal, index) => (
        <Col key={`${meal.slug}-${index}`} sm={12} md={6} lg={4} xl={3}>
          <Card
            heading={meal.title}
            imageSet={{ mobileSrc: meal.image }}
            imageAlt={meal.title}
            description={meal.description}
          >
            <BaseLink href={`/${meal.slug}`} variant="primary" underline="hover">
              Learn More
            </BaseLink>
          </Card>
        </Col>
      ))}

      {/* Sentinel for infinite scroll */}
      <div ref={watcherRef} className={styles.sentinel} />

      {isFetchingNextPage && <Spinner />}

      {!hasNextPage && items.length > 0 && <BottomLine label={bottomLineText} />}
    </>
  );
}
