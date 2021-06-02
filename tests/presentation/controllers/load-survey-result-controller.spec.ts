import mockDate from 'mockdate';
import faker from 'faker';

import { LoadSurveyResultController } from '@/presentation/controllers';
import { CheckSurveyByIdSpy, mockLoadSurveyResult } from '../mocks';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { Controller } from '@/presentation/protocols';
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result';
import { InvalidParamError } from '@/presentation/errors';

const mockRequest = (): LoadSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
});

type SutTypes = {
  sut: Controller;
  checkSurveyByIdSpy: CheckSurveyByIdSpy;
  loadSurveyResultStub: LoadSurveyResult;
};

const mockSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy();
  const loadSurveyResultStub = mockLoadSurveyResult();
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultStub);

  return {
    sut,
    checkSurveyByIdSpy,
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
  test('Should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdSpy } = mockSut();
    const checkByIdSpy = jest.spyOn(checkSurveyByIdSpy, 'checkById');

    const request = mockRequest();
    await sut.handle(request);
    expect(checkByIdSpy).toHaveBeenCalledWith(request.surveyId);
  });

  test('Should return 403 if CheckSurveyById returns null', async () => {
    const { sut, checkSurveyByIdSpy } = mockSut();
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdSpy } = mockSut();
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError);
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
