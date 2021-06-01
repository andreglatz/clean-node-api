import mockDate from 'mockdate';

import { LoadSurveyByIdRepository } from '@/data/usecases/survey/load-surveys-by-id/db-load-survey-by-id-protocols';
import { DbLoadSurveyById } from '@/data/usecases/survey/load-surveys-by-id/db-load-survey-by-id';
import { throwError, mockSurveyModel } from '@/domain/test';
import { mockLoadSurveyByIdRepository } from '../mocks';

type SutTypes = {
  sut: DbLoadSurveyById;
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository;
};

const surveyModel = mockSurveyModel();

const mockSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository(surveyModel);
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub);

  return {
    sut,
    loadSurveyByIdRepositoryStub,
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
    const { sut, loadSurveyByIdRepositoryStub } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
    await sut.loadById(surveyModel.id);
    expect(loadByIdSpy).toHaveBeenCalledWith(surveyModel.id);
  });

  test('Should return a survey on sucess', async () => {
    const { sut } = mockSut();
    const surveys = await sut.loadById(surveyModel.id);
    expect(surveys).toEqual(surveyModel);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = mockSut();
    jest
      .spyOn(loadSurveyByIdRepositoryStub, 'loadById')
      .mockImplementationOnce(throwError);
    const promise = sut.loadById(surveyModel.id);
    await expect(promise).rejects.toThrow();
  });
});
