import {
  CaloriesValue,
  CookTimeValue,
  DifficultyLevel,
  MealType,
  SmartSearchOptionsState,
} from '@/utils/types/meals';

// ─── private helpers ───────────────────────────────────────────────────────

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

// ─── exported ──────────────────────────────────────────────────────────────

export function normalizeSearchParams(params: {
  [key: string]: string | string[] | undefined;
}): SmartSearchOptionsState {
  const cookTimeRaw = toString(params.cookTime);
  const cookTime: CookTimeValue = isCookTimeValue(cookTimeRaw) ? cookTimeRaw : CookTimeValue.Any;

  const caloriesRaw = toString(params.maxCalories);
  const maxCalories: CaloriesValue = isMaxCaloriesValue(caloriesRaw)
    ? caloriesRaw
    : CaloriesValue.Any;

  const mealTypeRaw = toArray(params.mealType);
  const mealType: MealType[] = mealTypeRaw.filter(isMealType);

  const difficultyLevelRaw = toString(params.difficultyLevel);
  const difficultyLevel = isDifficultyLevelValue(difficultyLevelRaw)
    ? difficultyLevelRaw
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
