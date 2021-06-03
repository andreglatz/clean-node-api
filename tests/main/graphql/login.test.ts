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

type SignupMutationType = {
  signup: {
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

    it('Should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer });
      const email = faker.internet.email();
      const password = faker.internet.password();

      const response = await query<LoginQueryType>(loginQuery, { variables: { email, password } });

      expect(response.data).toBeNull();
      expect(response.errors[0].message).toBe('Unauthorized');
    });
  });

  describe('Signup Mutation', () => {
    let signupMutation: DocumentNode;

    beforeAll(() => {
      signupMutation = gql`
        mutation signup(
          $email: String!
          $name: String!
          $password: String!
          $passwordConfirmation: String!
        ) {
          signup(
            email: $email
            name: $name
            password: $password
            passwordConfirmation: $passwordConfirmation
          ) {
            accessToken
            name
          }
        }
      `;
    });

    it('Should return an Account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer });

      const password = faker.internet.password();
      const account = {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password,
        passwordConfirmation: password,
      };

      const response = await mutate<SignupMutationType>(signupMutation, { variables: account });

      expect(response.data.signup.accessToken).toBeTruthy();
      expect(response.data.signup.name).toBe(account.name);
    });
  });
});
