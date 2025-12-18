// src/utils/lib/graphql/schema.ts
import { getMealBySlug, getMealsData } from '@/utils/data-server/getMealsData';
import { createSchema } from 'graphql-yoga';
import { DifficultyLevel, Meal, MealType } from '@/utils/types/meals';
import { hasAnyOverlap, normalizeString, stringToArray } from '@/utils/lib/helpers';

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
    limit: Int = 8 #TODO: make it dynamic later, on mobile first 3 on desktop first 8
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
    calories: Int # per serving
    protein: Int # grams
    carbs: Int # grams
    fat: Int # grams
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
    # All meals
    meals(filter: MealsFilterInput, pagination: PaginationInput): MealsPage!

    # Meal by slug
    meal(slug: String!): Meal
  }
`;

export type MealsFilterInput = {
  search?: string | null;
  mealType?: MealType[] | null;
  cookTimeMin?: number | null;
  cookTimeMax?: number | null;
  searchTags?: string[] | null;
  includeIngredients?: string[] | null;
  excludeIngredients?: string[] | null;
  maxCalories?: number | null;
  difficulty?: DifficultyLevel | null;
};

export type PaginationInput = {
  limit?: number | null;
  offset?: number | null;
};

// Basic resolvers using dummy data for now
const resolvers = {
  Query: {
    meals: async (
      _parent: unknown,
      args: { filter?: MealsFilterInput; pagination?: PaginationInput }
    ) => {
      const allMeals = await getMealsData();

      const { filter, pagination } = args;
      const {
        search,
        mealType,
        cookTimeMin,
        cookTimeMax,
        searchTags,
        maxCalories,
        excludeIngredients,
        includeIngredients,
        difficulty,
      } = filter || {};

      // Filtering
      let filtered: Meal[] = allMeals;

      // With search keywords
      if (search) {
        const q = search.toLowerCase();
        const searchKeys = stringToArray(q);

        filtered = filtered.reduce<Meal[]>((res, item) => {
          const title = item.title.toLowerCase();
          const titleArr = stringToArray(title);

          if (hasAnyOverlap(searchKeys, titleArr)) {
            res.push(item);
          }
          return res;
        }, []);
      }

      // With mealTypes
      if (mealType && mealType.length > 0) {
        filtered = filtered.filter(
          (meal) =>
            Array.isArray(meal.mealType) &&
            meal.mealType.some((mt) => mealType.includes(mt as MealType))
        );
      }

      // With cookTime
      if (!!cookTimeMin || !!cookTimeMax) {
        filtered = filtered.filter((meal) => {
          if (meal.cookTime == null) return false;
          if (!!cookTimeMin && meal.cookTime < cookTimeMin) return false;
          if (!!cookTimeMax && meal.cookTime > cookTimeMax) return false;
          return true;
        });
      }

      // With searchTags
      if (!!searchTags && searchTags.length > 0) {
        filtered = filtered.filter((meal) => {
          if (!meal.tags || meal.tags.length === 0) return false;
          return hasAnyOverlap(searchTags, meal.tags);
        });
      }

      // With maxCalories
      if (!!maxCalories) {
        filtered = filtered.filter((meal) => {
          if (meal.nutritionInfo?.calories == null) return false;
          if (meal.nutritionInfo.calories > maxCalories) return false;
          return true;
        });
      }

      // With difficulty - only filter if difficulty is specified and not "any"
      if (difficulty && difficulty !== DifficultyLevel.Any) {
        filtered = filtered.filter((meal) => {
          if (meal.difficulty == null) return false;
          return meal.difficulty === difficulty;
        });
      }

      // With excludeIngredients - filter out meals that contain any excluded ingredient
      if (!!excludeIngredients && excludeIngredients.length > 0) {
        filtered = filtered.filter((meal) => {
          if (!meal.ingredients || meal.ingredients.length === 0) return true;

          // Normalize excluded ingredients to lowercase for case-insensitive comparison
          const excludedLower = excludeIngredients.map((ing) => normalizeString(ing));

          // Check if any meal ingredient matches any excluded ingredient
          const hasExcludedIngredient = meal.ingredients.some((ingredient) => {
            const ingredientText = normalizeString(ingredient.text);
            return excludedLower.some(
              (excluded) => ingredientText.includes(excluded) || excluded.includes(ingredientText)
            );
          });

          // Only include meals that don't have excluded ingredients
          return !hasExcludedIngredient;
        });
      }

      // With includeIngredients - only include meals that contain all included ingredients
      if (!!includeIngredients && includeIngredients.length > 0) {
        filtered = filtered.filter((meal) => {
          if (!meal.ingredients || meal.ingredients.length === 0) return false;

          // Normalize included ingredients to lowercase for case-insensitive comparison
          const includedLower = includeIngredients.map((ing) => normalizeString(ing));

          // Check if all included ingredients are present in the meal
          const hasAllIncludedIngredients = includedLower.every((included) =>
            meal.ingredients.some((ingredient) => {
              const ingredientText = normalizeString(ingredient.text);
              return ingredientText.includes(included) || included.includes(ingredientText);
            })
          );

          // Only include meals that have all included ingredients
          return hasAllIncludedIngredients;
        });
      }

      const total = filtered.length;
      const limit = pagination?.limit ?? 8;
      const offset = pagination?.offset ?? 0;

      const items = filtered.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return {
        items,
        total,
        hasMore,
      };
    },
    meal: async (_parent: unknown, args: { slug: string }) => {
      return getMealBySlug(args.slug);
    },
  },

  Meal: {
    topTags: (meal: Meal) => {
      // always return at most 3 tags; default to [] if undefined
      return (meal.tags ?? []).slice(0, 3);
    },
  },
};

export const mealsSchema = createSchema({
  typeDefs,
  resolvers,
});
