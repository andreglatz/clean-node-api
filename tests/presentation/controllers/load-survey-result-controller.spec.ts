import mockDate from 'mockdate';
import faker from 'faker';

import { LoadSurveyResultController } from '@/presentation/controllers';
import { mockLoadSurveyById, mockLoadSurveyResult } from '../mocks';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result';
import { InvalidParamError } from '@/presentation/errors';

const mockRequest = (): LoadSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: Controller;
  loadSurveyByIdStub: LoadSurveyById;
  loadSurveyResultStub: LoadSurveyResult;
};

const mockSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById(mockSurveyModel());
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub);

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub,
  };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });
  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    const request = mockRequest();
    await sut.handle(request);
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = mockSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = mockSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call LoadSurveyResult with correct value', async () => {
    const { sut, loadSurveyResultStub } = mockSut();
    const loadSpy = jest.spyOn(loadSurveyResultStub, 'load');

    const request = mockRequest();
    await sut.handle(request);
    expect(loadSpy).toHaveBeenCalledWith(request.surveyId);
  });

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = mockSut();
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = mockSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});