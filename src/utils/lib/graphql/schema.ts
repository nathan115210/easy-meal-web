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
  }

  input PaginationInput {
    limit: Int = 8 #TODO: make it dynamic later, on mobile first 3 on desktop first 8
    offset: Int = 0
  }

  type MealIngredient {
    text: String!
    amount: String!
  }

  type MealInstruction {
    image: String
    text: String!
  }

  type Meal {
    title: String!
    slug: String!
    image: String!
    description: String!
    ingredients: [MealIngredient!]!
    instructions: [MealInstruction!]!
    mealType: [MealType!]!
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
  tags?: string[] | null; //TODO: add tags filtering later, tags can be ['vegan', 'gluten-free', etc.]
};

type PaginationInput = {
  limit?: number | null;
  offset?: number | null;
};

// Basic resolvers using your dummy data
const resolvers = {
  Query: {
    meals: async (
      _parent: unknown,
      args: { filter?: MealsFilterInput; pagination?: PaginationInput }
    ) => {
      const allMeals = await getMealsData();

      const { filter, pagination } = args;

      // Filtering
      let filtered: Meal[] = allMeals;

      if (filter?.search) {
        const q = filter.search.toLowerCase();
        filtered = filtered.filter((meal) => meal.title.toLowerCase().includes(q));
      }

      if (filter?.mealType && filter.mealType.length > 0) {
        // keep meals that have at least one mealType in the filter list
        filtered = filtered.filter(
          (meal) =>
            Array.isArray(meal.mealType) &&
            meal.mealType.some((mt) => filter.mealType!.includes(mt as MealType))
        );
      }

      // Pagination (always 8 per page by default)
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
};
export const schema = createSchema({
  typeDefs,
  resolvers,
});
