import faker from 'faker';

import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyParams } from '@/domain/usercases/survey/add-survey';

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

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: faker.random.word(),
  answers: [
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
