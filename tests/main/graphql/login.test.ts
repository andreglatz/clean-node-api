import faker from 'faker';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import { createTestClient } from 'apollo-server-integration-testing';
import { ApolloServer, gql } from 'apollo-server-express';

import { MongoHelper } from '@/infra/db/mongodb/helpers';

import { makeApolloServer } from './helper';
import { DocumentNode } from 'apollo-link';

type LoginQueryType = {
  login: {
    accessToken: string;
    name: string;
  };
};

describe('Login GraphQL', () => {
  let accountCollection: Collection;
  let apolloServer: ApolloServer;

  beforeAll(async () => {
    apolloServer = makeApolloServer();
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    accountCollection.deleteMany({});
  });

  describe('Login Query', () => {
    let loginQuery: DocumentNode;

    beforeAll(() => {
      loginQuery = gql`
        query login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            accessToken
            name
          }
        }
      `;
    });

    it('Should return an Account on valid credentials', async () => {
      const password = faker.internet.password();
      const hashedPassword = await hash(password, 12);

      const account = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: hashedPassword,
      };

      await accountCollection.insertOne(account);

      const { query } = createTestClient({ apolloServer });

      const response = await query<LoginQueryType>(loginQuery, {
        variables: { email: account.email, password },
      });

      expect(response.data.login.accessToken).toBeTruthy();
      expect(response.data.login.name).toBe(account.name);
    });
  });
});
