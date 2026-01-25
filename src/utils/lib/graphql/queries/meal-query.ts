export const MEAL_QUERY = /* GraphQL */ `
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
      instructions {
        step
        image
        text
      }
      ingredients {
        text
        amount
      }
      nutritionInfo {
        calories
        protein
        fat
        carbs
      }
    }
  }
`;
