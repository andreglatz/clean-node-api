import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols';
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys';
import { throwError, mockSurveyModels } from '@/domain/test';
import { mockLoadSurveysRepository } from '../mocks';

import mockDate from 'mockdate';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const surveysModels = mockSurveyModels();

const mockSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository(surveysModels);
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = mockSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');
    await sut.load('any_id');
    expect(loadAllSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should returns a list of surveys on sucess', async () => {
    const { sut } = mockSut();
    const surveys = await sut.load('any_id');
    expect(surveys).toEqual(surveysModels);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = mockSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError);
    const promise = sut.load('any_id');
    await expect(promise).rejects.toThrow();
  });
});
