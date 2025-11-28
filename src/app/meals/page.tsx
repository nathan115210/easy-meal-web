import { Meal, MealType } from '@/utils/types/meals';
import styles from '@/app/meals/page.module.scss';
import { Grid, Row } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';

export type MealsListItem = Pick<Meal, 'title' | 'slug' | 'description' | 'image'>;

export type AllMealsPageProps = {
  searchParams?: {
    search?: string;
    mealType?: MealType[];
  };
};

export default async function AllMealsPage({ searchParams }: AllMealsPageProps) {
  const { search = '', mealType = undefined } = (await searchParams) ?? {};

  return (
    <Grid className={styles.mealsList}>
      <Row>
        <MealsInfiniteList search={search} clearHref={'/meals'} />
      </Row>
    </Grid>
  );
}
