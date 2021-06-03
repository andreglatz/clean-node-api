import faker from 'faker';
import { Collection } from 'mongodb';
import { createTestClient } from 'apollo-server-integration-testing';
import { ApolloServer, gql } from 'apollo-server-express';

import { MongoHelper } from '@/infra/db/mongodb/helpers';

import { makeApolloServer, mockAccessToken } from './helper';
import { DocumentNode } from 'apollo-link';

type SurveyResultQuery = {
  surveyResult: {
    question: string;
    answers: {
      answer: string;
      count: number;
      percent: number;
      isCurrentAccountAnswer: boolean;
    }[];
    date: Date;
  };
};

type SaveSurveyResultMutation = {
  saveSurveyResult: {
    question: string;
    answers: {
      answer: string;
      count: number;
      percent: number;
      isCurrentAccountAnswer: boolean;
    }[];
    date: Date;
  };
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

  describe('Sruvey Result Query', () => {
    let surveyResultQuery: DocumentNode;

    beforeAll(() => {
      surveyResultQuery = gql`
        query surveyResult($surveyId: String!) {
          surveyResult(surveyId: $surveyId) {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `;
    });

    it('Should return Survey Result', async () => {
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

      const surveyId = (await surveyCollection.insertOne(survey)).ops[0]._id.toString();

      const accessToken = await mockAccessToken(accountCollection);

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken,
          },
        },
      });

      const response = await query<SurveyResultQuery>(surveyResultQuery, {
        variables: {
          surveyId,
        },
      });

      expect(response.data.surveyResult.question).toBe(survey.question);
      expect(response.data.surveyResult.date).toEqual(survey.date.toISOString());
      expect(response.data.surveyResult.question).toBe(survey.question);
      expect(response.data.surveyResult.answers).toEqual(
        survey.answers.map(answer => ({
          answer: answer.answer,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        }))
      );
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

      const surveyId = (await surveyCollection.insertOne(survey)).ops[0]._id.toString();

      const { query } = createTestClient({ apolloServer });

      const response = await query<SurveyResultQuery>(surveyResultQuery, {
        variables: {
          surveyId,
        },
      });

      expect(response.data).toBeNull();
      expect(response.errors[0].message).toBe('Access denied');
    });
  });

  describe('Save Sruvey Result Mutation', () => {
    let saveSurveyResultMutation: DocumentNode;

    beforeAll(() => {
      saveSurveyResultMutation = gql`
        mutation saveSurveyResult($surveyId: String!, $answer: String!) {
          saveSurveyResult(surveyId: $surveyId, answer: $answer) {
            question
            answers {
              answer
              count
              percent
              isCurrentAccountAnswer
            }
            date
          }
        }
      `;
    });

    it('Should return Survey Result', async () => {
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

      const surveyId = (await surveyCollection.insertOne(survey)).ops[0]._id.toString();

      const accessToken = await mockAccessToken(accountCollection);

      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken,
          },
        },
      });

      const response = await mutate<SaveSurveyResultMutation>(saveSurveyResultMutation, {
        variables: {
          surveyId,
          answer: survey.answers[0].answer,
        },
      });

      expect(response.data.saveSurveyResult.date).toEqual(survey.date.toISOString());
      expect(response.data.saveSurveyResult.question).toBe(survey.question);
      expect(response.data.saveSurveyResult.answers).toEqual([
        {
          answer: survey.answers[0].answer,
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true,
        },
      ]);
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

      const surveyId = (await surveyCollection.insertOne(survey)).ops[0]._id.toString();

      const { mutate } = createTestClient({ apolloServer });

      const response = await mutate<SaveSurveyResultMutation>(saveSurveyResultMutation, {
        variables: {
          surveyId,
          answer: survey.answers[0].answer,
        },
      });

      expect(response.data).toBeNull();
      expect(response.errors[0].message).toBe('Access denied');
    });
  });
});
