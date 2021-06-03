import { ApolloServer } from 'apollo-server-express';

import resolvers from '@/main/graphql/resolvers';
import typeDefs from '@/main/graphql/type-defs';
import schemaDirectives from '@/main/graphql/directives';

export function makeApolloServer(): ApolloServer {
  return new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
  });
}
