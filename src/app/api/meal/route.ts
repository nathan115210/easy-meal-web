import { createYoga } from 'graphql-yoga';
import { mealSchema } from '@/utils/lib/graphql/schemas/meal-schema';

const yogaApp = createYoga({
  schema: mealSchema,
  graphqlEndpoint: '/api/meal',
  graphiql: process.env.NODE_ENV !== 'production',
});

export { yogaApp as GET, yogaApp as POST };
