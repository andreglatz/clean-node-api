import mockDate from 'mockdate';
import faker from 'faker';
import { LoadSurveysController } from '@/presentation/controllers';
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper';
import { throwError, mockSurveyModels } from '@/domain/test';
import { mockLoadSurvey } from '../mocks';
import { Controller } from '../protocols';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

const mockRequest = (): LoadSurveysController.Request => ({
  accountId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: Controller;
  loadSurveysStub: LoadSurveys;
};

const surveyModels = mockSurveyModels();

const mockSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurvey(surveyModels);
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

    const request = mockRequest();
    await sut.handle(request);
    expect(loadSpy).toHaveBeenCalledWith(request.accountId);
  });

  test('Should return 200 on success', async () => {
    const { sut } = mockSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(surveyModels));
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
