export const ALL_MEALS_QUERY = /* GraphQL */ `
  query AllMeals(
    $search: String
    $mealType: [MealType!]
    $difficulty: DifficultyLevel
    $cookTimeMin: Int
    $cookTimeMax: Int
    $maxCalories: Int
    $searchTags: [String!]
    $limit: Int
    $offset: Int
  ) {
    meals(
      filter: {
        search: $search
        mealType: $mealType
        difficulty: $difficulty
        cookTimeMin: $cookTimeMin
        cookTimeMax: $cookTimeMax
        maxCalories: $maxCalories
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
