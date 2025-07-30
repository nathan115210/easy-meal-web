import { Meal, MealIngredient, MealInstruction } from '@/types/meals';

export type MealDbRowType = Omit<Meal, 'ingredients' | 'instructions'> & { ingredients: string; instructions: string };
export const mealDbToMealData = (mealDbData: MealDbRowType): Meal => {
  const ingredients = JSON.parse(mealDbData.ingredients) as MealIngredient[];
  const instructions = JSON.parse(mealDbData.instructions) as MealInstruction[];
  return { ...mealDbData, ingredients, instructions } as Meal;
};
