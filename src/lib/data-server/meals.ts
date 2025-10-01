// Server-only data helpers for pages/layouts/route handlers.

import 'server-only';
import { Meal } from '@/types/meals';
import apiFetchServer from '@/lib/data-server/apiFetchServer';

export async function getMeals(): Promise<Meal[]> {
  return apiFetchServer<Meal[]>('/api/meals', { revalidate: 300, tags: ['meals:list'] });
}

type MealOrWrapped = Meal | { meal: Meal };

export async function getMealBySlug(slug: string): Promise<Meal | null> {
  try {
    const data = await apiFetchServer<MealOrWrapped>(`/api/meals/${slug}`, {
      revalidate: 300,
      tags: [`meal:${slug}`],
    });
    const meal = isWrappedMeal(data) ? data.meal : data;
    return meal as Meal;
  } catch {
    return null;
  }
}

export async function getAllMealSlugs(): Promise<string[]> {
  const meals = await getMeals();
  return meals.map((m) => m.slug);
}

// helpers
function isWrappedMeal(obj: MealOrWrapped): obj is { meal: Meal } {
  return typeof obj === 'object' && obj !== null && 'meal' in obj;
}
