import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResult } from '@/domain/usercases/survey-result/save-survey-result';

import faker from 'faker';

export const mockSurveyResultParams = (): SaveSurveyResult.Params => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: faker.random.word(),
  date: new Date(),
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.word(),
  answers: [
    {
      answer: faker.random.word(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false,
    },
  ],
  date: new Date(),
});
