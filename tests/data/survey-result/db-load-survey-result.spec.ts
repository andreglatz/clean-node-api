/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import {
  LoadSurveyResultRepository,
  LoadSurveyByIdRepository,
} from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result-protocols';

import { mockLoadSurveyResultRepository, mockLoadSurveyByIdRepository } from '../mocks';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const surveyModel = mockSurveyModel();

const mockSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(surveyModel);
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  );

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
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
    const loadBySurveyIdSpy = jest.spyOn(
      loadSurveyResultRepositoryStub,
      'loadBySurveyId'
    );
    await sut.load('any_survey_id');
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = mockSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } =
      mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockReturnValueOnce(Promise.resolve(null));
    await sut.load('any_survey_id');
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = mockSut();
    jest
      .spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
      .mockResolvedValueOnce(null);
    const surveyResult = await sut.load('any_survey_id');

    expect(surveyResult).toEqual({
      surveyId: surveyModel.id,
      question: surveyModel.question,
      answers: [
        {
          ...surveyModel.answers[0],
          count: 0,
          percent: 0,
        },
        {
          ...surveyModel.answers[1],
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
