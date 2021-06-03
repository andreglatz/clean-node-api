import faker from 'faker';
import { ApolloServer } from 'apollo-server-express';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';

import env from '@/main/config/env';
import resolvers from '@/main/graphql/resolvers';
import typeDefs from '@/main/graphql/type-defs';
import schemaDirectives from '@/main/graphql/directives';

export function makeApolloServer(): ApolloServer {
  return new ApolloServer({
    resolvers,
    typeDefs,
    schemaDirectives,
    context: ({ req }) => ({ req }),
  });
}

export async function mockAccessToken(accountCollection: Collection): Promise<string> {
  const accountFake = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const account = await accountCollection.insertOne(accountFake);
  const id = account.ops[0]._id;
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } });
  return accessToken;
}
