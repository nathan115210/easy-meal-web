export const ALL_MEALS_QUERY = /* GraphQL */ `
  query AllMeals(
    $search: String
    $mealType: [MealType!]
    $cookTimeMin: Int
    $cookTimeMax: Int
    $searchTags: [String!]
    $limit: Int
    $offset: Int
  ) {
    meals(
      filter: {
        search: $search
        mealType: $mealType
        cookTimeMin: $cookTimeMin
        cookTimeMax: $cookTimeMax
        searchTags: $searchTags
      }
      pagination: { limit: $limit, offset: $offset }
    ) {
      items {
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
      total
      hasMore
    }
  }
`;
