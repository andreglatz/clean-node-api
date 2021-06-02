/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';

import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '../mocks';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const mockSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyResultRepositorySpy,
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
    const { sut, loadSurveyResultRepositorySpy } = mockSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId');
    await sut.load('any_survey_id', 'any_account_id');

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id');
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = mockSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id', 'any_account_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_survey_id', 'any_account_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = mockSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockResolvedValueOnce(null);
    const surveyResult = await sut.load('any_survey_id', 'any_account_id');

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
    const { sut, loadSurveyResultRepositorySpy } = mockSut();
    const surveyResult = await sut.load('any_survey_id', 'any_account_id');
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.result);
  });
});
