'use client';
import React, { useEffect, useRef } from 'react';
import type { MealsListItem } from '@/app/meals/page';
import { Col, Grid, Row } from '@/components/grid/Grid';
import styles from '../page.module.scss';
import Card from '@/components/card/Card';
import BaseLink from '@/components/baseLink/BaseLink';
import { ALL_MEALS_QUERY } from '@/utils/lib/graphql/queries/meals-queries';
import { graphqlFetchClient } from '@/utils/data-server/graphqlFetchClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import Spinner from '@/components/spinner/Spinner';

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

async function fetchMealsData({
  pageParam,
  search,
  category,
}: {
  pageParam?: number;
  search?: string;
  category?: string;
}): Promise<MealsPagePayload['meals']> {
  const data = await graphqlFetchClient<MealsPagePayload>(ALL_MEALS_QUERY, {
    search,
    category,
    limit: PAGE_SIZE,
    offset: pageParam,
  });
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  await delay(500); // artificial delay for demo purposes

  return data.meals;
}

export default function MealsInfiniteList({ search, category }: MealsInfiniteListProps) {
  const watcherRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, status } = useInfiniteQuery({
    queryKey: ['meals', search, category],
    queryFn: ({ pageParam = 0 }) =>
      fetchMealsData({
        pageParam,
        search,
        category,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;

      return allPages.reduce((sum, page) => sum + page.items.length, 0); // next offset = number of items we already have
    },
  });

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  // IntersectionObserver to trigger fetching next page
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

  if (status === 'pending') {
    return <Spinner />;
  }

  if (status === 'error') {
    return (
      <div className={styles.loader}>
        <span>Something went wrong.</span>
        <pre className={styles.error}>{(error as Error).message}</pre>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <Grid className={styles.mealsList}>
      <Row>
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
      </Row>
      {/* watcher for infinite scroll */}
      <div ref={watcherRef} className={styles.sentinel} />

      {isFetchingNextPage && <Spinner />}

      {!hasNextPage && items.length > 0 && <p className={styles.bottomLine}>No more meals</p>}
    </Grid>
  );
}
