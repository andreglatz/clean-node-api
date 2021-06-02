/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';

import { LoadSurveyByIdRepositorySpy, mockLoadSurveyResultRepository } from '../mocks';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const mockSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositorySpy,
  };
};

const date = new Date();

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(date);
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSuveyResultRepository with correct value', async () => {
    const { sut, loadSurveyResultRepositoryStub } = mockSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = mockSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositorySpy } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_survey_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositorySpy } = mockSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockResolvedValueOnce(null);
    const surveyResult = await sut.load('any_survey_id');

    expect(surveyResult).toEqual({
      surveyId: loadSurveyByIdRepositorySpy.result.id,
      question: loadSurveyByIdRepositorySpy.result.question,
      answers: [
        {
          ...loadSurveyByIdRepositorySpy.result.answers[0],
          count: 0,
          percent: 0,
        },
        {
          ...loadSurveyByIdRepositorySpy.result.answers[1],
          count: 0,
          percent: 0,
        },
      ],
      date,
    });
  });

  test('Should return surveyResultModel on success', async () => {
    const { sut } = mockSut();
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
