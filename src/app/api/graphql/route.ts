import { createYoga } from 'graphql-yoga';
import { schema } from '@/utils/lib/graphql/schema';

const yogaApp = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  graphiql: process.env.NODE_ENV !== 'production',
});

export { yogaApp as GET, yogaApp as POST };
