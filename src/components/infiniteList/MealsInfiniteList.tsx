'use client';

import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Col, ColProps, Row } from '@/components/grid/Grid';
import RecipeCard from '@/components/recipeCard/RecipeCard';
import Spinner from '@/components/spinner/Spinner';
import BottomLine from '@/components/bottomLine/BottomLine';
import EmptyList from '@/app/meals/components/EmptyList';
import CardsListSkeleton from '@/components/skeleton/cardsListSkeleton/CardsListSkeleton';
import { CaloriesValue, CookTimeValue, DifficultyLevel, MealType } from '@/utils/types/meals';
import fetchMealsData from '@/utils/data-server/fetchMealsData';
import { usePathname } from 'next/navigation';
import styles from './mealsInfiniteList.module.scss';

export default function MealsInfiniteList({
  search,
  mealType,
  cookTime,
  gridLayout = { sm: 12, md: 6, lg: 4, xl: 3 },
  searchTags,
  maxCalories,
  difficultyLevel,
  excludeIngredients,
  includeIngredients,
}: {
  search?: string;
  mealType?: MealType[];
  cookTime?: CookTimeValue;
  maxCalories?: CaloriesValue;
  gridLayout?: ColProps;
  searchTags?: string[];
  difficultyLevel?: DifficultyLevel;
  excludeIngredients?: string[];
  includeIngredients?: string[];
}) {
  const pagePath = usePathname();

  const watcherRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [
      'meals',
      search,
      mealType,
      cookTime,
      searchTags,
      maxCalories,
      difficultyLevel,
      excludeIngredients,
      includeIngredients,
    ],
    queryFn: ({ pageParam = 0, signal }) =>
      fetchMealsData({
        pageParam,
        search,
        mealType,
        cookTime,
        signal,
        searchTags,
        difficulty: difficultyLevel,
        calories: maxCalories,
        excludeIngredients,
        includeIngredients,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
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
    if (!hasNextPage || !watcherRef.current) {
      return;
    }

    const node = watcherRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root: null, rootMargin: '0px', threshold: 0 }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Initial load state
  if (status === 'pending') {
    return (
      <Row>
        <CardsListSkeleton gridLayout={gridLayout} />
      </Row>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <Row data-testid="meals-list-error">
        <div className={styles.errorState}>
          <span>Something went wrong loading meals. Please try again.</span>
        </div>
      </Row>
    );
  }

  if (!items.length)
    return (
      <EmptyList
        search={search}
        mealType={mealType}
        cookTime={cookTime}
        clearHref={pagePath}
        data-testid="meals-empty-list"
      />
    );

  const bottomLineText = !!search ? '🔍 That’s all we found' : '🍽️  All meals loaded';

  return (
    <Row data-testid="meals-infinite-list">
      {items.map((meal, index) => {
        return (
          <Col
            data-testid="meal-card"
            className={styles.listContainer}
            key={`${meal.slug}-${index}`}
            {...gridLayout}
          >
            <RecipeCard
              title={meal.title}
              imageSet={{ mobileSrc: meal.image }}
              imageAlt={meal.title}
              time={meal.cookTime ? `${meal.cookTime} mins` : ''}
              difficulty={parseDifficulty(meal.difficulty)}
              category={meal.mealType?.[0] ?? meal.topTags?.[0] ?? ''}
              href={`/meals/${meal.slug}`}
            />
          </Col>
        );
      })}

      <div ref={watcherRef} data-testid="infinite-scroll-watcher" />

      {isFetchingNextPage && <Spinner />}

      {!hasNextPage && items.length > 0 && (
        <BottomLine label={bottomLineText} showClear={!!search || !!mealType || !!cookTime} />
      )}
    </Row>
  );
}

// Helpers
type ExtractDifficultyLevelType = 'Easy' | 'Med' | 'Hard';

const DIFFICULTY_VALUES = new Set<ExtractDifficultyLevelType>(['Easy', 'Med', 'Hard']);

/**
 * Type guard: checks whether a value is one of the allowed difficulty strings.
 */
function isDifficulty(value: unknown): value is ExtractDifficultyLevelType {
  return typeof value === 'string' && DIFFICULTY_VALUES.has(value as ExtractDifficultyLevelType);
}

/**
 * Parse a string into ExtractDifficultyLevelType if it matches (case-insensitive).
 * Recognizes common synonym "Medium" -> "Med".
 * Returns `undefined` when no match is found.
 */
function parseDifficulty(value?: string | null): ExtractDifficultyLevelType {
  if (!value) return 'Med';
  const trimmed = value?.trim() || 'Med';
  if (isDifficulty(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();

  if (lower === 'easy') return 'Easy';
  if (lower === 'hard') return 'Hard';
  return 'Med';
}
