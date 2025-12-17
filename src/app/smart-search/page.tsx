import styles from './page.module.scss';
import SmartSearchPanel from '@/app/smart-search/components/smartSearchPanel/SmartSearchPanel';
import { Grid } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';
import {
  CaloriesValue,
  CookTimeValue,
  DifficultyLevel,
  MealType,
  SmartSearchOptionsState,
} from '@/utils/types/meals';

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
  } = resolvedSearchParams;
  const extractedTags = [...dietaryPreferences, ...healthTags, ...specialTags, ...occasionTags];

  return (
    <div className={styles.smartSearch}>
      <div className={styles.searchPanel}>
        <SmartSearchPanel />
      </div>
      <div className={styles.searchResults}>
        <Grid>
          <MealsInfiniteList
            gridLayout={{ sm: 12, md: 6, lg: 6, xl: 4 }}
            cookTime={cookTime}
            mealType={mealType}
            search={search}
            searchTags={extractedTags}
            maxCalories={maxCalories}
            difficultyLevel={difficultyLevel}
          />
        </Grid>
      </div>
    </div>
  );
}

// Helpers

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

const COOK_TIME_VALUES = new Set<string>(Object.values(CookTimeValue));
const MEAL_TYPE_VALUES = new Set<string>(Object.values(MealType));
const CALORIES_VALUES = new Set<string>(Object.values(CaloriesValue));
const DIFFICULTY_LEVEL_VALUES = new Set<string>(Object.values(DifficultyLevel));

function isCookTimeValue(value: string): value is CookTimeValue {
  return COOK_TIME_VALUES.has(value);
}

function isMealType(value: string): value is MealType {
  return MEAL_TYPE_VALUES.has(value);
}

function isMaxCaloriesValue(value: string): value is CaloriesValue {
  return CALORIES_VALUES.has(value);
}

function isDifficultyLevelValue(value: string): value is DifficultyLevel {
  return DIFFICULTY_LEVEL_VALUES.has(value);
}

function normalizeSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): SmartSearchOptionsState {
  const cookTimeRaw = toString(params.cookTime);
  const cookTime: CookTimeValue = isCookTimeValue(cookTimeRaw) ? cookTimeRaw : CookTimeValue.Any;

  const caloriesRow = toString(params.maxCalories);
  const maxCalories: CaloriesValue = isMaxCaloriesValue(caloriesRow)
    ? caloriesRow
    : CaloriesValue.Any;

  const mealTypeRaw = toArray(params.mealType);
  const mealType: MealType[] = mealTypeRaw.filter(isMealType);

  const difficultyLevelRow = toString(params.difficultyLevel);
  const difficultyLevel = isDifficultyLevelValue(difficultyLevelRow)
    ? difficultyLevelRow
    : DifficultyLevel.Any;
  return {
    existIngredients: toArray(params.existIngredients),
    excludeIngredients: toArray(params.excludeIngredients),
    cookTime,
    dietaryPreferences: toArray(params.dietaryPreferences),
    maxCalories,
    difficultyLevel,
    mealType,
    specialTags: toArray(params.specialTags),
    occasionTags: toArray(params.occasionTags),
    healthTags: toArray(params.healthTags),
    search: toString(params.search),
  };
}
