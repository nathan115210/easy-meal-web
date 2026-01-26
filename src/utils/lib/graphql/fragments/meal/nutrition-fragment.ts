export const MEAL_NUTRITION_FRAGMENT = /* GraphQL */ `
  fragment MealNutrition on Meal {
    nutritionInfo {
      calories
      protein
      fat
      carbs
    }
  }
`;
