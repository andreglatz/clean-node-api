import faker from 'faker';

import { SurveyModel } from '@/domain/models/survey';
import { AddSurvey } from '../usercases/survey/add-survey';

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.word(),
  answers: [
    {
      answer: faker.random.word(),
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
    },
  ],
  date: new Date(),
});

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.word(),
  answers: [
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
    },
    {
      answer: faker.random.word(),
      image: faker.image.imageUrl(),
    },
  ],
  date: new Date(),
});

export const mockSurveyModels = (): SurveyModel[] => {
  return [
    {
      id: faker.datatype.uuid(),
      question: faker.random.word(),
      answers: [
        {
          answer: faker.random.word(),
          image: faker.image.imageUrl(),
        },
      ],
      date: new Date(),
    },
    {
      id: faker.datatype.uuid(),
      question: faker.random.word(),
      answers: [
        {
          answer: faker.random.word(),
          image: faker.image.imageUrl(),
        },
      ],
      date: new Date(),
    },
  ];
};
