import styles from './page.module.scss';
import SmartSearchPanel from '@/app/smart-search/components/smartSearchPanel/SmartSearchPanel';
import { Grid, Row } from '@/components/grid/Grid';
import MealsInfiniteList from '@/components/infiniteList/MealsInfiniteList';
import { CookTimeValue, MealType, SmartSearchOptionsState } from '@/utils/types/meals';

type SmartSearchPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SmartSearchPage({ searchParams }: SmartSearchPageProps) {
  const params = (await searchParams) ?? {};
  const resolvedSearchParams = normalizeSearchParams(params);
  const { cookTime, mealType } = resolvedSearchParams;

  return (
    <div className={styles.smartSearch}>
      <div className={styles.searchPanel}>
        <SmartSearchPanel />
      </div>
      <div className={styles.searchResults}>
        <Grid>
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

function isCookTimeValue(value: string): value is CookTimeValue {
  return COOK_TIME_VALUES.has(value);
}

function isMealType(value: string): value is MealType {
  return MEAL_TYPE_VALUES.has(value);
}

function normalizeSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): SmartSearchOptionsState {
  const cookTimeRaw = toString(params.cookTime);
  const cookTime: CookTimeValue = isCookTimeValue(cookTimeRaw) ? cookTimeRaw : CookTimeValue.Any;

  const mealTypeRaw = toArray(params.mealType);
  const mealType: MealType[] = mealTypeRaw.filter(isMealType);

  return {
    existIngredients: toArray(params.existIngredients),
    excludeIngredients: toArray(params.excludeIngredients),
    cookTime,
    dietaryPreferences: toArray(params.dietaryPreferences),
    maxCalories: toString(params.maxCalories),
    difficultyLevel: toString(params.difficultyLevel),
    mealType,
    specialTags: toArray(params.specialTags),
    occasionTags: toArray(params.occasionTags),
    healthTags: toArray(params.healthTags),
  };
}
