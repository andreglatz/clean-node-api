import mockDate from 'mockdate';

import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-surveys-by-id/db-load-survey-by-id-protocols';
import { DbLoadSurveyById } from '@/data/usecases/survey/load-surveys-by-id/db-load-survey-by-id';
import { throwError, mockSurveyModel } from '@/domain/test';
import { LoadSurveyByIdRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const mockSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyByIdRepositorySpy,
  };
};

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');
    await sut.loadById(loadSurveyByIdRepositorySpy.result.id);
    expect(loadByIdSpy).toHaveBeenCalledWith(loadSurveyByIdRepositorySpy.result.id);
  });

  test('Should return a survey on sucess', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    const surveys = await sut.loadById(loadSurveyByIdRepositorySpy.result.id);
    expect(surveys).toEqual(loadSurveyByIdRepositorySpy.result);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValueOnce(new Error());

    const promise = sut.loadById(loadSurveyByIdRepositorySpy.result.id);
    await expect(promise).rejects.toThrow();
  });
});
