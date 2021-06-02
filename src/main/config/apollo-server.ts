import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from '@/main/graphql/type-defs';
import resolvers from '@/main/graphql/resolvers';
import { GraphQLError } from 'graphql';

function handleError(response: any, errors: readonly GraphQLError[]): void {
  errors?.forEach(error => {
    response.data = undefined;

    if (checkError(error, 'UserInputError')) response.http.status = 400;
    if (checkError(error, 'AuthenticationError')) response.http.status = 401;
    if (checkError(error, 'ForbiddenError')) response.http.status = 403;
    if (checkError(error, 'ApolloError')) response.http.status = 500;
  });
}

function checkError(error: GraphQLError, errorName: string): boolean {
  return [error.name, error.originalError.name].some(name => name === errorName);
}

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [
      {
        requestDidStart: () => ({
          willSendResponse: ({ response, errors }) => handleError(response, errors),
        }),
      },
    ],
  });

  server.applyMiddleware({ app });
};
