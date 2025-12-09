// src/utils/lib/graphql/schema.ts
import { getMealBySlug, getMealsData } from '@/utils/data-server/getMealsData';
import { createSchema } from 'graphql-yoga';
import type { Meal, MealType } from '@/utils/types/meals';

const typeDefs = /* GraphQL */ `
  enum MealType {
    breakfast
    lunch
    dinner
    snacks
    dessert
    drinks
  }

  input MealsFilterInput {
    search: String
    mealType: [MealType!]
    cookTimeMin: Int
    cookTimeMax: Int
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

  enum DifficultyLevel {
    easy
    medium
    hard
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

type MealsFilterInput = {
  search?: string | null;
  mealType?: MealType[] | null;
  cookTimeMin?: number | null;
  cookTimeMax?: number | null;
  //tags?: string[] | null; //TODO: add tags filtering later, tags can be ['vegan', 'gluten-free', etc.]
};

type PaginationInput = {
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
      const { search, mealType, cookTimeMin, cookTimeMax } = filter || {};

      // Filtering
      let filtered: Meal[] = allMeals;

      // With search keywords
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((meal) => meal.title.toLowerCase().includes(q));
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
