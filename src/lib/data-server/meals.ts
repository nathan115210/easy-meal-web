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
    const meal = (data as any)?.meal ?? (data as any);
    return meal as Meal;
  } catch {
    return null;
  }
}

export async function getAllMealSlugs(): Promise<string[]> {
  const meals = await getMeals();
  return meals.map((m) => m.slug);
}
