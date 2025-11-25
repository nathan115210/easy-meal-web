export const ALL_MEALS_QUERY = /* GraphQL */ `
  query AllMeals($search: String, $mealType: [MealType!], $limit: Int, $offset: Int) {
    meals(
      filter: { search: $search, mealType: $mealType }
      pagination: { limit: $limit, offset: $offset }
    ) {
      items {
        title
        slug
        image
        description
      }
      total
      hasMore
    }
  }
`;
