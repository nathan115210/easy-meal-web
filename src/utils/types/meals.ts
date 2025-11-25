
export interface Meal {
  title: string;
  slug: string;
  image: string;
  description: string;
  ingredients: MealIngredient[];
  instructions: MealInstruction[];
  total_cook_time?: number; // in minutes
  difficulty?: DifficultyLevel;
  nutrition?: NutritionInfo; //TODO: figuring out how to calculate
  mealType?: MealType[];
}

export interface MealIngredient {
  text: string;
  amount: string;
}

export interface MealInstruction {
  image?: string;
  text: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface NutritionInfo {
  calories: number; // per serving
  protein?: number; // grams
  carbs?: number; // grams
  fat?: number; // grams
}

export enum MealType {
  Breakfast = 'breakfast',
  Lunch = 'lunch',
  Dinner = 'dinner',
  Snacks = 'snacks',
  Dessert = 'dessert',
  Drinks = 'drinks',
}

