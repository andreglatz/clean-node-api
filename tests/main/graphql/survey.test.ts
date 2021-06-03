import faker from 'faker';
import { Collection } from 'mongodb';
import { createTestClient } from 'apollo-server-integration-testing';
import { ApolloServer, gql } from 'apollo-server-express';

import { MongoHelper } from '@/infra/db/mongodb/helpers';

import { makeApolloServer, mockAccessToken } from './helper';
import { DocumentNode } from 'apollo-link';

type SurveysQuery = {
  surveys: {
    id: string;
    question: string;
    answers: {
      answer: string;
      image?: string;
    }[];
    date: Date;
    didAnswer: boolean;
  }[];
};

describe('Survey GraphQL', () => {
  let accountCollection: Collection;
  let surveyCollection: Collection;

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

    surveyCollection = await MongoHelper.getCollection('surveys');
    surveyCollection.deleteMany({});
  });

  describe('Surveys Query', () => {
    let surveysQuery: DocumentNode;

    beforeAll(() => {
      surveysQuery = gql`
        query surveys {
          surveys {
            id
            question
            answers {
              image
              answer
            }
            date
            didAnswer
          }
        }
      `;
    });

    it('Should return Surveys', async () => {
      const survey = {
        question: faker.random.word(),
        answers: [
          {
            answer: faker.random.word(),
            image: faker.image.imageUrl(),
          },
        ],
        date: new Date(),
      };

      await surveyCollection.insertOne(survey);

      const accessToken = await mockAccessToken(accountCollection);

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken,
          },
        },
      });

      const response = await query<SurveysQuery>(surveysQuery);

      expect(response.data.surveys.length).toBe(1);
      expect(response.data.surveys[0].id).toBeTruthy();
      expect(response.data.surveys[0].answers).toEqual(survey.answers);
      expect(response.data.surveys[0].date).toEqual(survey.date.toISOString());
      expect(response.data.surveys[0].question).toBe(survey.question);
      expect(response.data.surveys[0].didAnswer).toBe(false);
    });

    it('Should return AccessDeniedError if no token is provided', async () => {
      const survey = {
        question: faker.random.word(),
        answers: [
          {
            answer: faker.random.word(),
            image: faker.image.imageUrl(),
          },
        ],
        date: new Date(),
      };

      await surveyCollection.insertOne(survey);

      const { query } = createTestClient({ apolloServer });

      const response = await query<SurveysQuery>(surveysQuery);

      expect(response.data).toBeNull();
      expect(response.errors[0].message).toBe('Access denied');
    });
  });
});
