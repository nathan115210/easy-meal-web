import { Meal, MealIngredient } from '@/types/meals';

export type MealDbRowType = Omit<Meal, 'ingredients'> & { ingredients: string };
export const mealDbToMealData = (mealDbData: MealDbRowType): Meal => {
  const ingredients = JSON.parse(mealDbData.ingredients as string) as MealIngredient[];
  return { ...mealDbData, ingredients } as Meal;
};
