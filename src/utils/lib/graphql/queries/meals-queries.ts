export const ALL_MEALS_QUERY = /* GraphQL */ `
  query AllMeals($search: String, $category: String, $limit: Int, $offset: Int) {
    meals(
      filter: { search: $search, category: $category }
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
