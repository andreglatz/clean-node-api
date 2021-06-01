/* eslint-disable @typescript-eslint/no-unused-vars */
import mockDate from 'mockdate';

import {
  AddSurvey,
  AddSurveyRepository,
} from '@/data/usecases/survey/add-survey/db-add-survey-protocols';

import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey';
import { throwError, mockAddSurveyParams } from '@/domain/test';
import { mockAddSurveyRepository } from '../mocks';

type SutTypes = {
  sut: AddSurvey;
  addSurveyRepositoryStub: AddSurveyRepository;
};

const mockSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  beforeAll(() => {
    mockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = mockSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = mockAddSurveyParams();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = mockSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
