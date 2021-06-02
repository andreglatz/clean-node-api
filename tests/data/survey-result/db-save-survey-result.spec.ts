import MockDate from 'mockdate';

import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result';
import { throwError, mockSurveyResultParams } from '@/domain/test';
import { LoadSurveyResultRepositorySpy, SaveSurveyResultRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbSaveSurveyResult;
  saveSurveyResultRepositorySpy: SaveSurveyResultRepositorySpy;
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy;
};

const mockSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();

  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy, loadSurveyResultRepositorySpy);

  return {
    sut,
    saveSurveyResultRepositorySpy,
    loadSurveyResultRepositorySpy,
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositorySpy } = mockSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositorySpy, 'save');
    const surveyResultData = mockSurveyResultParams();
    await sut.save(surveyResultData);
    expect(saveSpy).toHaveBeenCalledWith(surveyResultData);
  });

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = mockSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId');
    const surveyResultData = mockSurveyResultParams();

    await sut.save(surveyResultData);
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(
      surveyResultData.surveyId,
      surveyResultData.accountId
    );
  });

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositorySpy } = mockSut();
    jest.spyOn(saveSurveyResultRepositorySpy, 'save').mockImplementationOnce(throwError);
    const promise = sut.save(mockSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = mockSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError);
    const promise = sut.save(mockSurveyResultParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should returns a list of surveys on sucess', async () => {
    const { sut, loadSurveyResultRepositorySpy } = mockSut();

    const surveys = await sut.save(mockSurveyResultParams());

    expect(surveys).toEqual(loadSurveyResultRepositorySpy.result);
  });
});
