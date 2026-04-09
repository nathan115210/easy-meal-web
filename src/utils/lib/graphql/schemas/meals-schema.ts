import { getMealBySlug, getMealsData } from '@/utils/data-server/getMealsData';
import { createSchema } from 'graphql-yoga';
import { Meal, MealType as UiMealType } from '@/utils/types/meals';

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
  mealType?: UiMealType[] | null;
  cookTimeMin?: number | null;
  cookTimeMax?: number | null;
  searchTags?: string[] | null;
  includeIngredients?: string[] | null;
  excludeIngredients?: string[] | null;
  maxCalories?: number | null;
  difficulty?: string | null;
};

export type PaginationInput = {
  limit?: number | null;
  offset?: number | null;
};

const resolvers = {
  Query: {
    meals: async (
      _parent: unknown,
      args: { filter?: MealsFilterInput; pagination?: PaginationInput },
    ) => {
      return getMealsData(
        {
          search: args.filter?.search,
          mealType: args.filter?.mealType,
          cookTimeMin: args.filter?.cookTimeMin,
          cookTimeMax: args.filter?.cookTimeMax,
          searchTags: args.filter?.searchTags,
          maxCalories: args.filter?.maxCalories,
          excludeIngredients: args.filter?.excludeIngredients,
          includeIngredients: args.filter?.includeIngredients,
          difficulty: args.filter?.difficulty,
        },
        {
          limit: args.pagination?.limit,
          offset: args.pagination?.offset,
        },
      );
    },

    meal: async (_parent: unknown, args: { slug: string }) => {
      return (await getMealBySlug(args.slug)) ?? null;
    },
  },

  Meal: {
    topTags: (meal: Meal, args: { limit?: number | null }) => {
      const limit = args?.limit ?? 3;
      return (meal.tags ?? []).slice(0, Math.max(0, limit));
    },
  },
};

export const mealsSchema = createSchema({
  typeDefs,
  resolvers,
});
