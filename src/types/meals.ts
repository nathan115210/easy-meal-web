export interface Meal {
  title: string;
  slug: string;
  image: string;
  description: string;
  ingredients: MealIngredient[];
  instructions: string;
  creator: string;
  creator_email: string;
}

export interface MealIngredient {
  text: string;
  amount: string;
}