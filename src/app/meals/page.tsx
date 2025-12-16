import { Meal, MealType } from '@/utils/types/meals';
import styles from '@/app/meals/page.module.scss';
import { Grid } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';

export type MealsListItem = Pick<
  Meal,
  | 'title'
  | 'slug'
  | 'description'
  | 'image'
  | 'cookTime'
  | 'mealType'
  | 'topTags'
  | 'difficulty'
  | 'nutritionInfo'
>;

export type AllMealsPageProps = {
  searchParams?: {
    search?: string;
    mealType?: MealType[];
  };
};

export default async function AllMealsPage({ searchParams }: AllMealsPageProps) {
  const { search = '' } = (await searchParams) ?? {};

  return (
    <Grid className={styles.mealsList} data-testid="meals-list-page">
      <MealsInfiniteList search={search} />
    </Grid>
  );
}
