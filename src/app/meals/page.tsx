import type { Meal } from '@/utils/types/meals';
import MealsInfiniteList from '@/app/meals/components/MealsInfiniteList';
import styles from '@/app/meals/page.module.scss';
import { Grid, Row } from '@/components/grid/Grid';

export type MealsListItem = Pick<Meal, 'title' | 'slug' | 'description' | 'image'>;

type AllMealsPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
  };
};

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
