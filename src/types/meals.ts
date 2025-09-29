export interface Meal {
  title: string;
  slug: string;
  image: string;
  description: string;
  ingredients: MealIngredient[];
  instructions: MealInstruction[];
  creator: string;
  creator_email: string;
  category: string[];
}

export interface MealIngredient {
  text: string;
  amount: string;
}

export interface MealInstruction {
  image?: string;
  text: string;
}