// Helper to fetch meal data by slug from GraphQL API
import { graphqlFetchClient } from '@/utils/data-server/graphqlFetchClient';
import { type Meal } from '@/utils/types/meals';
import { MEAL_QUERY } from '@/utils/lib/graphql/queries/meal-query';

/**
 * Fetches a single meal by its slug from the GraphQL API.
 * @param slug - The meal's unique slug
 * @param signal
 * @returns The meal data or null if not found
 * @throws Error if the request fails
 */

type MealQueryPayload = { meal: Meal | null };

export async function fetchMealDataBySlug(
  slug: string,
  signal?: AbortSignal
): Promise<MealQueryPayload['meal']> {
  if (!slug) throw new Error('Missing meal slug');

  const data = await graphqlFetchClient<MealQueryPayload>({
    apiEndPoint: '/api/meal', // avoid trailing slash unless you truly need it
    query: MEAL_QUERY,
    variables: { slug },
    signal,
  });

  return data.meal ?? null;
}
