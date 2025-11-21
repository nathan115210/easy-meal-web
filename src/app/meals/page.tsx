import type { Meal } from '@/utils/types/meals';
import type { Metadata } from 'next';
import MealsInfiniteList from '@/app/meals/components/MealsInfiniteList';
import styles from '@/app/meals/page.module.scss';
import { Grid, Row } from '@/components/grid/Grid';

export const metadata: Metadata = {
  title: 'All Meals | Meal Planner',
  description:
    'Browse all meals: healthy recipes with ingredients, prep time, and dietary filters.',
  keywords: ['meals', 'recipes', 'meal planning', 'healthy eating', 'diet'],
  alternates: { canonical: '/all-meals' },
  openGraph: {
    title: 'All Meals | Meal Planner',
    description: 'Discover every meal available in our recipe catalog.',
    url: '#TODOall-meals',
    type: 'website',
    images: [
      {
        url: '#TODO/og/all-meals.png',
        width: 1200,
        height: 630,
        alt: 'Meal gallery preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Meals | Meal Planner',
    description: 'Discover every meal available in our recipe catalog.',
    images: ['#TODO/og/all-meals.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export type MealsListItem = Pick<Meal, 'title' | 'slug' | 'description' | 'image'>;

export type MealsPageResult = {
  meals: {
    items: MealsListItem[];
    total: number;
    hasMore: boolean;
  };
};

type AllMealsPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
  };
};

/*
async function fetchInitialMeals(params: {
  search?: string;
  category?: string;
}): Promise<MealsPageResult['meals']> {
  const gqlResponse = await apiFetchServer<GraphQLResponse<MealsPageResult>>('/api/graphql', {
    method: 'POST',
    body: {
      query: ALL_MEALS_QUERY,
      variables: {
        search: params.search ?? null,
        category: params.category ?? null,
        limit: 8,
        offset: 0,
      },
    },
    tags: ['meals:list'],
  });

  if (gqlResponse.errors) {
    console.error(gqlResponse.errors);
    throw new Error('GraphQL error when fetching meals (initial page)');
  }

  if (!gqlResponse.data) {
    throw new Error('Missing data from GraphQL (initial page)');
  }

  return gqlResponse.data.meals;
}
*/

export default async function AllMealsPage({ searchParams }: AllMealsPageProps) {
  const { q = '', category = '' } = (await searchParams) ?? {};

  return (
    <Grid className={styles.mealsList}>
      <Row>
        <MealsInfiniteList search={q} category={category} />
      </Row>
    </Grid>
  );
}
