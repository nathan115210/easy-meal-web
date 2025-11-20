import type { Meal } from '@/utils/types/meals';
import { mealsData } from '@/utils/constants/mealsDummyData';

export async function getMealsData(): Promise<Meal[]> {
  return Array.isArray(mealsData) ? mealsData : [];
}

export async function getMealBySlug(slug: string): Promise<Meal | undefined> {
  const meals = await getMealsData();
  return meals.find((meal) => meal.slug === slug);
}
