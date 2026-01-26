export const MEAL_INGREDIENTS_FRAGMENT = /* GraphQL */ `
  fragment MealIngredients on Meal {
    ingredients {
      text
      amount
    }
  }
`;
