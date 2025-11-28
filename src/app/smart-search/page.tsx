import styles from './page.module.scss';
import SmartSearchPanel from '@/app/smart-search/components/smartSearchPanel/SmartSearchPanel';
import { Grid, Row } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';
import { SmartSearchOptionsState } from '@/utils/types/meals';

type SmartSearchPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SmartSearchPage({ searchParams }: SmartSearchPageProps) {
  const params = (await searchParams) ?? {};
  const resolvedSearchParams = normalizeSearchParams(params ?? {});
  const { cookTime, mealType } = resolvedSearchParams;

  return (
    <div className={styles.smartSearch}>
      <div className={styles.searchPanel}>
        <SmartSearchPanel />
      </div>
      <div className={styles.searchResults}>
        <Grid className={styles.mealsList}>
          <Row>
            <MealsInfiniteList
              gridLayout={{ sm: 12, md: 6, lg: 6, xl: 4 }}
              cookTime={cookTime}
              mealType={mealType}
            />
          </Row>
        </Grid>
      </div>
    </div>
  );
}

// helpers

function toArray(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value))
    return value.flatMap((v) =>
      v
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toString(value?: string | string[]): string {
  if (!value) return '';
  if (Array.isArray(value)) return value[0] ?? '';
  return value;
}

function normalizeSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): SmartSearchOptionsState {
  return {
    existIngredients: toArray(params.existIngredients),
    excludeIngredients: toArray(params.excludeIngredients),
    cookTime: toString(params.cookTime) as SmartSearchOptionsState['cookTime'],
    dietaryPreferences: toArray(params.dietaryPreferences),
    maxCalories: toString(params.maxCalories),
    difficultyLevel: toString(params.difficultyLevel),
    mealType: toArray(params.mealType) as SmartSearchOptionsState['mealType'],
    specialTags: toArray(params.specialTags),
    occasionTags: toArray(params.occasionTags),
    healthTags: toArray(params.healthTags),
  };
}
