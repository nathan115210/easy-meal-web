import { graphql, HttpResponse } from 'msw';
import { DifficultyLevel, Meal, MealType } from '@/utils/types/meals';
import type { MealsListItem } from '@/app/meals/page';

const mockAllMeals: Meal[] = [
  {
    slug: 'spicy-chicken-bowl',
    title: 'Spicy Chicken Bowl',
    image: '/images/mock/spicy-chicken-bowl.jpg',
    description: 'A quick high-protein spicy chicken rice bowl.',
    ingredients: [
      { text: 'Chicken breast', amount: '200g' },
      { text: 'Rice', amount: '150g' },
    ],
    instructions: [
      { step: 1, text: 'Cook the rice.' },
      { step: 2, text: 'Stir-fry chicken with spices.' },
    ],
    mealType: [MealType.Dinner],
    cookTime: 20,
    tags: ['high-protein', 'spicy'],
    topTags: ['high-protein', 'spicy'],
    difficulty: DifficultyLevel.Easy,
    nutritionInfo: {
      calories: 650,
      protein: 45,
      carbs: 70,
      fat: 15,
    },
  },
  {
    slug: 'veggie-pasta',
    title: 'Creamy Veggie Pasta',
    image: '/images/mock/creamy-veggie-pasta.jpg',
    description: 'Comforting vegetarian pasta with seasonal veggies.',
    ingredients: [
      { text: 'Pasta', amount: '120g' },
      { text: 'Mixed veggies', amount: '150g' },
    ],
    instructions: [
      { step: 1, text: 'Boil pasta.' },
      { step: 2, text: 'Cook veggies and mix with sauce.' },
    ],
    mealType: [MealType.Lunch, MealType.Dinner],
    cookTime: 25,
    tags: ['vegetarian'],
    topTags: ['vegetarian'],
    difficulty: DifficultyLevel.Medium,
    nutritionInfo: {
      calories: 580,
      protein: 18,
      carbs: 80,
      fat: 18,
    },
  },
  {
    slug: 'quick-avocado-toast',
    title: 'Quick Avocado Toast',
    image: '/images/mock/quick-avocado-toast.jpg',
    description: 'Breakfast-ready toast with avocado and egg.',
    ingredients: [
      { text: 'Bread', amount: '2 slices' },
      { text: 'Avocado', amount: '1/2' },
    ],
    instructions: [
      { step: 1, text: 'Toast the bread.' },
      { step: 2, text: 'Smash avocado and spread.' },
    ],
    mealType: [MealType.Breakfast],
    cookTime: 10,
    tags: ['quick', 'breakfast'],
    topTags: ['quick', 'breakfast'],
    difficulty: DifficultyLevel.Easy,
    nutritionInfo: {
      calories: 350,
      protein: 12,
      carbs: 30,
      fat: 20,
    },
  },
];

// === Types for GraphQL handler generics ===

type AllMealsQueryVariables = {
  search?: string | null;
  mealType?: MealType[] | null;
  cookTimeMin?: number | null;
  cookTimeMax?: number | null;
  limit?: number | null;
  offset?: number | null;
};

type AllMealsQueryResult = {
  meals: {
    items: MealsListItem[];
    total: number;
    hasMore: boolean;
  };
};

type MealQueryVariables = { slug: string };
type MealQueryResult = { meal: Meal | null };

// Scope GraphQL handlers to GraphQL Yoga endpoint
const api = graphql.link('/api/all-meals');

// Helper: downcast full Meal → MealsListItem
function toMealsListItem(meal: Meal): MealsListItem {
  const {
    title,
    slug,
    description,
    image,
    cookTime,
    mealType,
    topTags,
    difficulty,
    nutritionInfo,
  } = meal;

  return {
    title,
    slug,
    description,
    image,
    cookTime,
    mealType,
    topTags,
    difficulty,
    nutritionInfo,
  };
}

export const allMealsHandlers = [
  // query AllMeals(...) { meals { items, total, hasMore } }
  api.query<AllMealsQueryResult, AllMealsQueryVariables>('AllMeals', ({ variables }) => {
    const { search, mealType, cookTimeMin, cookTimeMax, limit, offset } = variables ?? {};

    let filteredMeals = [...mockAllMeals];

    // search on title + description
    if (search) {
      const q = search.toLowerCase();
      filteredMeals = filteredMeals.filter(
        (meal) => meal.title.toLowerCase().includes(q) || meal.description.toLowerCase().includes(q)
      );
    }

    // mealType filter
    if (mealType && mealType.length > 0) {
      filteredMeals = filteredMeals.filter(
        (meal) =>
          Array.isArray(meal.mealType) && meal.mealType.some((item) => mealType.includes(item))
      );
    }

    // cookTime bounds – support: only min, only max, or both
    if (cookTimeMin != null || cookTimeMax != null) {
      filteredMeals = filteredMeals.filter((meal) => {
        if (meal.cookTime == null) return false;
        if (cookTimeMin != null && meal.cookTime < cookTimeMin) return false;
        if (cookTimeMax != null && meal.cookTime > cookTimeMax) return false;
        return true;
      });
    }

    const pageSize = limit ?? 8;
    const pageOffset = offset ?? 0;
    const total = filteredMeals.length;

    const slice = filteredMeals.slice(pageOffset, pageOffset + pageSize);
    const items: MealsListItem[] = slice.map(toMealsListItem);
    const hasMore = pageOffset + pageSize < total;

    return HttpResponse.json({
      data: {
        meals: {
          items,
          total,
          hasMore,
        },
      },
    });
  }),

  // query Meal($slug) { meal(slug: $slug) { ... } }
  api.query<MealQueryResult, MealQueryVariables>('Meal', ({ variables }) => {
    const slug = variables.slug;
    const meal = mockAllMeals.find((item) => item.slug === slug) ?? null;

    return HttpResponse.json({
      data: {
        meal,
      },
    });
  }),
];
