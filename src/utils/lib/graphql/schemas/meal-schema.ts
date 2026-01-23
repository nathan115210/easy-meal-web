import { getMealBySlug, getMealsData } from '@/utils/data-server/getMealsData';
import { createSchema } from 'graphql-yoga';
import { Meal, MealType } from '@/utils/types/meals';
import { hasAnyOverlap, normalizeString, stringToArray } from '@/utils/lib/helpers';

// GraphQL type definitions for meals, ingredients, instructions, and enums.
const typeDefs = /* GraphQL */ `
  enum MealType {
    breakfast
    lunch
    dinner
    snacks
    dessert
    drinks
  }

  enum DifficultyLevel {
    any
    easy
    medium
    hard
  }

  input MealsFilterInput {
    search: String
    mealType: [MealType!]
    cookTimeMin: Int
    cookTimeMax: Int
    searchTags: [String!]
    includeIngredients: [String!]
    excludeIngredients: [String!]
    maxCalories: Int
    difficulty: DifficultyLevel
  }

  input PaginationInput {
    limit: Int = 8 # TODO: Make this dynamic for mobile/desktop
    offset: Int = 0
  }

  type MealIngredient {
    text: String!
    amount: String!
  }

  type MealInstructionItem {
    step: Int!
    image: String
    text: String!
  }

  type NutritionInfo {
    calories: Int
    protein: Int
    carbs: Int
    fat: Int
  }

  type Meal {
    title: String!
    slug: String!
    image: String!
    description: String!
    ingredients: [MealIngredient!]!
    instructions: [MealInstructionItem!]!
    mealType: [MealType!]!
    cookTime: Int
    tags: [String!]
    topTags(limit: Int = 3): [String!]!
    difficulty: DifficultyLevel
    nutritionInfo: NutritionInfo
  }

  type MealsPage {
    items: [Meal!]!
    total: Int!
    hasMore: Boolean!
  }

  type Query {
    meals(filter: MealsFilterInput, pagination: PaginationInput): MealsPage!
    meal(slug: String!): Meal
  }
`;

// TypeScript types for filter and pagination input
export type MealsFilterInput = {
  search?: string | null;
  mealType?: MealType[] | null;
  cookTimeMin?: number | null;
  cookTimeMax?: number | null;
  searchTags?: string[] | null;
  includeIngredients?: string[] | null;
  excludeIngredients?: string[] | null;
  maxCalories?: number | null;
  // Keep this flexible because your TS DifficultyLevel type may be:
  // - string union: "any" | "easy" | ...
  // - string enum
  // - or something else in your codebase
  difficulty?: unknown;
};

export type PaginationInput = {
  limit?: number | null;
  offset?: number | null;
};

const ALLOWED_DIFFICULTY = new Set(['any', 'easy', 'medium', 'hard']);

function normalizeDifficulty(input: unknown): string | null {
  if (input == null) return null;

  // Most common case: string union or string enum value
  if (typeof input === 'string') return input.toLowerCase();

  // If someone passes an enum object value weirdly (rare), attempt to stringify
  try {
    const s = String(input).toLowerCase();
    return s;
  } catch {
    return null;
  }
}

// GraphQL resolvers for querying meals and meal by slug
const resolvers = {
  Query: {
    meals: async (
      _parent: unknown,
      args: { filter?: MealsFilterInput; pagination?: PaginationInput }
    ) => {
      const allMeals = await getMealsData();
      const { filter, pagination } = args;

      const search = filter?.search ?? null;
      const mealType = filter?.mealType ?? null;
      const cookTimeMin = filter?.cookTimeMin ?? null;
      const cookTimeMax = filter?.cookTimeMax ?? null;
      const searchTags = filter?.searchTags ?? null;
      const maxCalories = filter?.maxCalories ?? null;
      const excludeIngredients = filter?.excludeIngredients ?? null;
      const includeIngredients = filter?.includeIngredients ?? null;

      const difficultyRaw = filter?.difficulty ?? null;
      const difficulty = normalizeDifficulty(difficultyRaw);

      let filtered: Meal[] = allMeals;

      // Filter by search keywords
      if (search) {
        const q = search.toLowerCase();
        const searchKeys = stringToArray(q);

        filtered = filtered.reduce<Meal[]>((res, item) => {
          const titleArr = stringToArray(item.title.toLowerCase());
          if (hasAnyOverlap(searchKeys, titleArr)) res.push(item);
          return res;
        }, []);
      }

      // Filter by mealType
      if (mealType && mealType.length > 0) {
        filtered = filtered.filter(
          (meal) =>
            Array.isArray(meal.mealType) &&
            meal.mealType.some((mt) => mealType.includes(mt as MealType))
        );
      }

      // Filter by cookTime (handle 0 correctly)
      if (cookTimeMin != null || cookTimeMax != null) {
        filtered = filtered.filter((meal) => {
          if (meal.cookTime == null) return false;
          if (cookTimeMin != null && meal.cookTime < cookTimeMin) return false;
          if (cookTimeMax != null && meal.cookTime > cookTimeMax) return false;
          return true;
        });
      }

      // Filter by searchTags
      if (searchTags && searchTags.length > 0) {
        const wanted = searchTags.map((t) => normalizeString(t));
        filtered = filtered.filter((meal) => {
          if (!meal.tags || meal.tags.length === 0) return false;
          const have = meal.tags.map((t) => normalizeString(t));
          return hasAnyOverlap(wanted, have);
        });
      }

      // Filter by maxCalories (handle 0 correctly)
      if (maxCalories != null) {
        filtered = filtered.filter((meal) => {
          const cals = meal.nutritionInfo?.calories;
          if (cals == null) return false;
          return cals <= maxCalories;
        });
      }

      // Filter by difficulty (only if specified and not "any")
      if (difficulty) {
        if (!ALLOWED_DIFFICULTY.has(difficulty)) {
          throw new Error(`Invalid difficulty value: ${String(difficultyRaw)}`);
        }

        if (difficulty !== 'any') {
          filtered = filtered.filter((meal) => {
            if (meal.difficulty == null) return false;
            return String(meal.difficulty).toLowerCase() === difficulty;
          });
        }
      }

      // Filter out meals with excluded ingredients
      if (excludeIngredients && excludeIngredients.length > 0) {
        const excludedLower = excludeIngredients.map((ing) => normalizeString(ing));

        filtered = filtered.filter((meal) => {
          if (!meal.ingredients || meal.ingredients.length === 0) return true;

          const hasExcludedIngredient = meal.ingredients.some((ingredient) => {
            const ingredientText = normalizeString(ingredient.text);
            return excludedLower.some(
              (excluded) => ingredientText.includes(excluded) || excluded.includes(ingredientText)
            );
          });

          return !hasExcludedIngredient;
        });
      }

      // Only include meals that contain all included ingredients
      if (includeIngredients && includeIngredients.length > 0) {
        const includedLower = includeIngredients.map((ing) => normalizeString(ing));

        filtered = filtered.filter((meal) => {
          if (!meal.ingredients || meal.ingredients.length === 0) return false;

          return includedLower.every((included) =>
            meal.ingredients.some((ingredient) => {
              const ingredientText = normalizeString(ingredient.text);
              return ingredientText.includes(included) || included.includes(ingredientText);
            })
          );
        });
      }

      // Pagination
      const total = filtered.length;
      const limit = pagination?.limit ?? 8;
      const offset = pagination?.offset ?? 0;

      const safeLimit = Math.max(0, limit);
      const safeOffset = Math.max(0, offset);

      const items = filtered.slice(safeOffset, safeOffset + safeLimit);
      const hasMore = safeOffset + safeLimit < total;

      return { items, total, hasMore };
    },

    meal: async (_parent: unknown, args: { slug: string }) => {
      return getMealBySlug(args.slug);
    },
  },

  Meal: {
    // Respect the `limit` argument from the schema
    topTags: (meal: Meal, args: { limit?: number | null }) => {
      const limit = args?.limit ?? 3;
      return (meal.tags ?? []).slice(0, Math.max(0, limit));
    },
  },
};

// Export the schema for use in the GraphQL server
export const mealSchema = createSchema({
  typeDefs,
  resolvers,
});
