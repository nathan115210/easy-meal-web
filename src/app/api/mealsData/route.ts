import { createYoga } from 'graphql-yoga';
import { mealsSchema } from '@/utils/lib/graphql/schemas/meals-schema';

const yogaApp = createYoga({
  schema: mealsSchema,
  graphqlEndpoint: '/api/mealsData',
  graphiql: process.env.NODE_ENV !== 'production',
});

export { yogaApp as GET, yogaApp as POST };
