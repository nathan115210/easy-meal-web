import 'server-only';

import { DifficultyLevel, Meal, MealType as UiMealType, NutritionInfo } from '@/utils/types/meals';
import { prisma } from '@/utils/lib/prisma';
import { normalizeString } from '@/utils/lib/helpers';
import { MealType as PrismaMealType, Prisma } from '../../../prisma/generated/prisma/client';

// ── Public types ─────────────────────────────────────────────────────────────

export type MealsFilter = {
  search?: string | null;
  mealType?: UiMealType[] | null;
  cookTimeMin?: number | null;
  cookTimeMax?: number | null;
  searchTags?: string[] | null;
  includeIngredients?: string[] | null;
  excludeIngredients?: string[] | null;
  maxCalories?: number | null;
  /** Lowercase difficulty string: 'easy' | 'medium' | 'hard' | 'any' */
  difficulty?: string | null;
};

export type MealsPagination = {
  limit?: number | null;
  offset?: number | null;
};

export type MealsPage = {
  items: Meal[];
  total: number;
  hasMore: boolean;
};

// ── Public functions ──────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 8;

/**
 * Fetch a paginated, filtered page of meals from the database.
 * All filtering and pagination happens in Postgres — no full-table loads.
 */
export async function getMealsData(
  filter?: MealsFilter,
  pagination?: MealsPagination
): Promise<MealsPage> {
  const where = buildWhereClause(filter ?? {});

  const limit = Math.max(0, pagination?.limit ?? DEFAULT_PAGE_SIZE);
  const offset = Math.max(0, pagination?.offset ?? 0);

  // Run count + page fetch in a single transaction for consistency.
  const [total, mealsDb] = await prisma.$transaction([
    prisma.meal.count({ where }),
    prisma.meal.findMany({
      where,
      // Only select the scalar fields needed for list responses.
      // Ingredients and instructions are not requested by AllMeals queries.
      select: MEAL_LIST_SELECT,
      orderBy: { id: 'asc' },
      skip: offset,
      take: limit,
    }),
  ]);

  return {
    items: mealsDb.map(extractDbToMealSummary),
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Return every meal slug — used by generateStaticParams for ISR.
 * Only fetches the slug column; no relations loaded.
 */
export async function getAllMealSlugs(): Promise<string[]> {
  const rows = await prisma.meal.findMany({
    select: { slug: true },
    orderBy: { id: 'asc' },
  });
  return rows.map((r) => r.slug);
}

/**
 * Fetch a single meal by its URL slug, including all relations.
 * Returns undefined when no meal matches the slug.
 */
export async function getMealBySlug(slug: string): Promise<Meal | undefined> {
  console.log('[getMealBySlug] input slug:', slug);
  const mealDb = await prisma.meal.findUnique({
    where: { slug },
    include: { ingredients: true, instructions: true },
  });
  console.log('[getMealBySlug] result:', mealDb);

  if (!mealDb) return undefined;
  return extractDbToMeal(mealDb);
}

// ── Where-clause builder ──────────────────────────────────────────────────────

function buildWhereClause(filter: MealsFilter): Prisma.MealWhereInput {
  const {
    search,
    mealType,
    cookTimeMin,
    cookTimeMax,
    searchTags,
    maxCalories,
    difficulty,
    includeIngredients,
    excludeIngredients,
  } = filter;

  const where: Prisma.MealWhereInput = {};

  // Title search: match any word (OR across words, case-insensitive).
  if (search) {
    const words = normalizeString(search).split(/\s+/).filter(Boolean);
    if (words.length > 0) {
      where.OR = words.map((word) => ({
        title: { contains: word, mode: 'insensitive' as const },
      }));
    }
  }

  // Meal type: any of the provided types.
  if (mealType && mealType.length > 0) {
    where.mealType = { hasSome: mealType as PrismaMealType[] };
  }

  // Cook time range.
  const cookTimeWhere: Prisma.IntFilter = {};
  if (cookTimeMin != null) cookTimeWhere.gte = cookTimeMin;
  if (cookTimeMax != null) cookTimeWhere.lte = cookTimeMax;
  if (Object.keys(cookTimeWhere).length > 0) {
    where.cookTime = cookTimeWhere;
  }

  // Tags: any of the provided tags (tags stored lowercase in DB).
  if (searchTags && searchTags.length > 0) {
    where.tags = { hasSome: searchTags.map(normalizeString) };
  }

  // Calorie ceiling.
  if (maxCalories != null) {
    where.calories = { lte: maxCalories };
  }

  // Difficulty exact match (skip 'any').
  if (difficulty && difficulty !== 'any') {
    where.difficulty = difficulty;
  }

  // Ingredient filters — combined into a single AND array so they compose correctly.
  // Each includeIngredients term: at least one ingredient must match.
  // Each excludeIngredients term: no ingredient may match.
  // Using { NOT: cond } inside AND rather than a top-level NOT array avoids the
  // Prisma v4.6+ behaviour change where NOT:[a,b] means NOT(a AND b) instead of NOT(a) AND NOT(b).
  const ingredientClauses: Prisma.MealWhereInput[] = [];

  if (includeIngredients && includeIngredients.length > 0) {
    for (const term of includeIngredients) {
      ingredientClauses.push({
        ingredients: {
          some: { text: { contains: normalizeString(term), mode: 'insensitive' as const } },
        },
      });
    }
  }

  if (excludeIngredients && excludeIngredients.length > 0) {
    for (const term of excludeIngredients) {
      ingredientClauses.push({
        NOT: {
          ingredients: {
            some: { text: { contains: normalizeString(term), mode: 'insensitive' as const } },
          },
        },
      });
    }
  }

  if (ingredientClauses.length > 0) {
    where.AND = ingredientClauses;
  }

  return where;
}

// ── DB row select / mappers ───────────────────────────────────────────────────

/** Scalar-only select used for list queries (no ingredient/instruction relations). */
const MEAL_LIST_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  image: true,
  mealType: true,
  cookTime: true,
  tags: true,
  difficulty: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
} as const;

type DbMealListRow = Prisma.MealGetPayload<{ select: typeof MEAL_LIST_SELECT }>;
type DbMealWithRelations = Prisma.MealGetPayload<{
  include: { ingredients: true; instructions: true };
}>;

/** Map a scalar-only DB row to a Meal (ingredients/instructions left empty). */
function extractDbToMealSummary(dbMeal: DbMealListRow): Meal {
  return {
    title: dbMeal.title,
    slug: dbMeal.slug,
    image: dbMeal.image,
    description: dbMeal.description,
    ingredients: [],
    instructions: [],
    cookTime: dbMeal.cookTime,
    difficulty: dbMeal.difficulty as DifficultyLevel,
    nutritionInfo: buildNutritionInfo(dbMeal),
    mealType: dbMeal.mealType.map(mapPrismaMealTypeToUi),
    tags: dbMeal.tags,
  };
}

/** Map a full DB row (with relations) to a Meal. */
function extractDbToMeal(dbMeal: DbMealWithRelations): Meal {
  return {
    title: dbMeal.title,
    slug: dbMeal.slug,
    image: dbMeal.image,
    description: dbMeal.description,
    ingredients: dbMeal.ingredients.map((ing) => ({
      text: ing.text,
      amount: ing.amount,
    })),
    instructions: dbMeal.instructions
      .slice()
      .sort((a, b) => a.step - b.step)
      .map((inst) => ({
        text: inst.text,
        image: inst.image ?? '',
        step: inst.step,
      })),
    cookTime: dbMeal.cookTime,
    difficulty: dbMeal.difficulty as DifficultyLevel,
    nutritionInfo: buildNutritionInfo(dbMeal),
    mealType: dbMeal.mealType.map(mapPrismaMealTypeToUi),
    tags: dbMeal.tags,
  };
}

function buildNutritionInfo(dbMeal: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}): NutritionInfo {
  return {
    calories: dbMeal.calories,
    protein: dbMeal.protein,
    carbs: dbMeal.carbs,
    fat: dbMeal.fat,
  };
}

function mapPrismaMealTypeToUi(type: PrismaMealType): UiMealType {
  switch (type) {
    case PrismaMealType.breakfast:
      return UiMealType.Breakfast;
    case PrismaMealType.lunch:
      return UiMealType.Lunch;
    case PrismaMealType.dinner:
      return UiMealType.Dinner;
    case PrismaMealType.snacks:
      return UiMealType.Snacks;
    case PrismaMealType.dessert:
      return UiMealType.Dessert;
    case PrismaMealType.drinks:
      return UiMealType.Drinks;
  }
}
