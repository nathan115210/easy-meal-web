export const ALL_MEALS_QUERY = /* GraphQL */ `
  query AllMeals(
    $search: String
    $mealType: [MealType!]
    $cookTimeMin: Int
    $cookTimeMax: Int
    $limit: Int
    $offset: Int
  ) {
    meals(
      filter: {
        search: $search
        mealType: $mealType
        cookTimeMin: $cookTimeMin
        cookTimeMax: $cookTimeMax
      }
      pagination: { limit: $limit, offset: $offset }
    ) {
      items {
        title
        slug
        image
        description
        cookTime
      }
      total
      hasMore
    }
  }
`;
