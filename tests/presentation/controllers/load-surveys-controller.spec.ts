import mockDate from 'mockdate';

import { LoadSurveysController } from '@/presentation/controllers';
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper';
import { throwError, mockSurveyModels } from '@/domain/test';
import { mockLoadSurvey } from '../mocks';
import { Controller, HttpRequest } from '../protocols';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

const mockRequest = (): HttpRequest => ({ accountId: 'any_id' });

type SutTypes = {
  sut: Controller;
  loadSurveysStub: LoadSurveys;
};

const mockSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurvey();
  const sut = new LoadSurveysController(loadSurveysStub);

  return {
    sut,
    loadSurveysStub,
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = mockSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');
    await sut.handle(mockRequest());
    expect(loadSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return 200 on success', async () => {
    const { sut } = mockSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyModels()));
  });

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = mockSut();
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = mockSut();
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
