import { MEAL_INGREDIENTS_FRAGMENT } from '../fragments/meal/ingredients-fragment';
import { MEAL_INSTRUCTIONS_FRAGMENT } from '../fragments/meal/instruction-fragment';
import { MEAL_NUTRITION_FRAGMENT } from '../fragments/meal/nutrition-fragment';

export const MEAL_QUERY =
  /* GraphQL */ `
  query Meal($slug: String!) {
    meal(slug: $slug) {
      title
      slug
      image
      cookTime
      tags
      topTags
      difficulty
      description
      ...MealInstructions
      ...MealIngredients
      ...MealNutrition
    }
  }
` +
  MEAL_INSTRUCTIONS_FRAGMENT +
  MEAL_INGREDIENTS_FRAGMENT +
  MEAL_NUTRITION_FRAGMENT;
