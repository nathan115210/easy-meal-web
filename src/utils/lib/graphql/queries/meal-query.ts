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
      nutritionInfo {
        calories
        protein
        fat
        carbs
      }
    }
  }
`;
