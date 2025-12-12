import { CookTimeValue, MealType } from '@/utils/types/meals';
import type { MealsListItem } from '@/app/meals/page';
import { graphqlFetchClient } from '@/utils/data-server/graphqlFetchClient';
import { ALL_MEALS_QUERY } from '@/utils/lib/graphql/queries/meals-queries';
import { mapCookTimeToBounds } from '@/utils/lib/helpers';

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
  pageParam = 0,
  search,
  mealType,
  cookTime,
  signal,
  limit = PAGE_SIZE,
}: {
  pageParam?: number;
  search?: string;
  mealType?: MealType[];
  cookTime?: CookTimeValue;

  signal: AbortSignal;
  limit?: number;
}): Promise<MealsPagePayload['meals']> {
  const { cookTimeMin, cookTimeMax } = mapCookTimeToBounds(cookTime);
  const data = await graphqlFetchClient<MealsPagePayload>(
    '/api/all-meals',
    ALL_MEALS_QUERY,
    {
      search,
      mealType,
      cookTimeMin,
      cookTimeMax,
      limit,
      offset: pageParam,
    },
    signal
  );

  return data.meals;
}

export default fetchMealsData;
