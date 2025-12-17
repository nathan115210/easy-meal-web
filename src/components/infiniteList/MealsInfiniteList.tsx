'use client';

import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Col, ColProps, Row } from '@/components/grid/Grid';
import Card from '@/components/card/Card';
import BaseLink from '@/components/baseLink/BaseLink';
import Spinner from '@/components/spinner/Spinner';
import BottomLine from '@/components/bottomLine/BottomLine';
import EmptyList from '@/app/meals/components/EmptyList';
import CardsListSkeleton from '@/components/skeleton/cardsListSkeleton/CardsListSkeleton';
import { CaloriesValue, CookTimeValue, DifficultyLevel, MealType } from '@/utils/types/meals';
import fetchMealsData from '@/utils/data-server/fetchMealsData';
import { usePathname } from 'next/navigation';
import ChipsGroup from '@/components/chip/ChipsGroup';
import Chip, { ChipVariant } from '@/components/chip/Chip';
import { underscoreToTitle } from '@/utils/lib/helpers';
import styles from './mealsInfiniteList.module.scss';
import { Check, ChefHat, Flame } from 'lucide-react';

export default function MealsInfiniteList({
  search,
  mealType,
  cookTime,
  gridLayout = { sm: 12, md: 6, lg: 4, xl: 3 },
  searchTags,
  maxCalories,
  difficultyLevel,
}: {
  search?: string;
  mealType?: MealType[];
  cookTime?: CookTimeValue;
  maxCalories?: CaloriesValue;
  gridLayout?: ColProps;
  searchTags?: string[];
  difficultyLevel?: DifficultyLevel;
}) {
  const pagePath = usePathname();

  const watcherRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, status } = useInfiniteQuery({
    queryKey: ['meals', search, mealType, cookTime, searchTags, maxCalories, difficultyLevel],
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
      { root: null, rootMargin: '0px', threshold: 1.0 }
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
        <CardsListSkeleton />
      </Row>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div data-testid="meals-list-error">
        <span>Something went wrong.</span>
        <pre>{(error as Error).message}</pre>
      </div>
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
        const { difficulty, nutritionInfo: { calories } = {} } = meal;
        const quickInfo = [parseCalories(calories), parseDifficulty(difficulty)].filter(Boolean);
        const tags = new Set([...(meal.topTags ?? []), ...(searchTags ?? [])]);

        const cardTags = extractTagsFromMealsSearchParams(meal.topTags, searchTags);

        return (
          <Col className={styles.listContainer} key={`${meal.slug}-${index}`} {...gridLayout}>
            <Card
              data-testid="meal-card"
              heading={meal.title}
              imageSet={{ mobileSrc: meal.image }}
              imageAlt={meal.title}
              label={`${meal.cookTime} mins`}
            >
              {/*Quick Info*/}
              <div className={styles.quickInfo}>
                {quickInfo.map(
                  (item, index) =>
                    item && (
                      <span key={`${-item}-${index}`} className={styles['quickInfo-item']}>
                        {isDifficulty(item) && <ChefHat size={12} />}
                        {isCalories(item) && <Flame size={12} />}

                        {item}
                      </span>
                    )
                )}
              </div>
              {/*//TODO - Start: Add new feature for displaying dynamic tags
                1. if there is no tags from search params, show topTags from meal
                2. if there are tags from search params, show those tags and highlight them. if the tag is not in meal.topTags, add meal.topTags at the end
              */}
              {/*Top tags*/}
              {tags.size > 0 && (
                <ChipsGroup ariaLabel={`${meal.title} - top tags`}>
                  {[...cardTags].map((tag, index) => {
                    const isHighlighted = searchTags?.includes(tag);
                    const variant: ChipVariant = isHighlighted ? 'success' : 'secondary';
                    return (
                      <Chip
                        key={`${meal.title}-${tag}-${index}`}
                        label={underscoreToTitle(tag)}
                        size={'sm'}
                        variant={variant}
                        type={'label'}
                        labelIcon={isHighlighted ? <Check size={14} /> : undefined}
                      />
                    );
                  })}
                </ChipsGroup>
              )}
              {/* //TODO - END */}

              <BaseLink href={`/${meal.slug}`} variant="primary" underline="hover">
                Learn More
              </BaseLink>
            </Card>
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

function parseCalories(value?: number): string | undefined {
  if (value) return `${value} Kcal`;
  return undefined;
}

function isCalories(value: unknown): boolean {
  return typeof value === 'string' && value.includes('Kcal');
}

// Reordering each meal's topTags and searchTags. Put searchTags first in the list.
function extractTagsFromMealsSearchParams(topTags?: string[], searchTags?: string[]): string[] {
  if (!topTags || topTags.length === 0) return [];
  if (!searchTags || searchTags.length === 0) return [...topTags];

  const priority = new Set(searchTags);
  const inPriority: string[] = [];
  const rest: string[] = [];

  for (const item of topTags) {
    (priority.has(item) ? inPriority : rest).push(item);
  }

  return [...inPriority, ...rest];
}
