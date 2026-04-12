import { Suspense } from 'react';
import styles from './page.module.scss';
import SmartSearchPanel from '@/app/smart-search/components/smartSearchPanel/SmartSearchPanel';
import { Grid } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';
import { normalizeSearchParams } from '@/app/smart-search/normalizeSearchParams';

type SmartSearchPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SmartSearchPage({ searchParams }: SmartSearchPageProps) {
  const resolvedSearchParams = normalizeSearchParams((await searchParams) ?? {});
  const {
    cookTime,
    mealType,
    search,
    dietaryPreferences,
    healthTags,
    specialTags,
    occasionTags,
    maxCalories,
    difficultyLevel,
    excludeIngredients,
    existIngredients,
  } = resolvedSearchParams;
  const extractedTags = [...dietaryPreferences, ...healthTags, ...specialTags, ...occasionTags];

  return (
    <div className={styles.smartSearch}>
      <div className={styles.searchPanel}>
        <Suspense>
          <SmartSearchPanel />
        </Suspense>
      </div>
      <div className={styles.searchResults}>
        <Grid>
          <MealsInfiniteList
            gridLayout={{ sm: 12, xl: 4 }}
            cookTime={cookTime}
            mealType={mealType}
            search={search}
            searchTags={extractedTags}
            maxCalories={maxCalories}
            difficultyLevel={difficultyLevel}
            excludeIngredients={excludeIngredients}
            includeIngredients={existIngredients}
          />
        </Grid>
      </div>
    </div>
  );
}
