import faker from 'faker';
import mockDate from 'mockdate';

import { SaveSurveyResultController } from '@/presentation/controllers';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import { LoadSurveyByIdSpy, mockSaveSurveyResult } from '../mocks';
import { Controller } from '../protocols';
import { SaveSurveyResult } from '@/domain/usercases/survey-result/save-survey-result';

const mockRequest = (answer: string): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: answer,
});

type SutTypes = {
  sut: Controller;
  loadSurveyByIdSpy: LoadSurveyByIdSpy;
  saveSurveyResultStub: SaveSurveyResult;
};

const mockSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultStub);

  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultStub,
  };
};

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdSpy, 'loadById');

    const request = mockRequest(loadSurveyByIdSpy.result.answers[0].answer);
    await sut.handle(request);
    expect(loadByIdSpy).toHaveBeenCalledWith(request.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = mockSut();
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest(loadSurveyByIdSpy.result.answers[0].answer));
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = mockSut();
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest(loadSurveyByIdSpy.result.answers[0].answer));
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = mockSut();

    const HttpRequest = {
      params: {
        surveyId: 'any_survey_id',
      },
      body: {
        answer: 'wrong_answer',
      },
    };

    const httpResponse = await sut.handle(HttpRequest);
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub, loadSurveyByIdSpy } = mockSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const request = mockRequest(loadSurveyByIdSpy.result.answers[0].answer);
    await sut.handle(request);
    expect(saveSpy).toHaveBeenCalledWith({
      ...request,
      date: new Date(),
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub, loadSurveyByIdSpy } = mockSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest(loadSurveyByIdSpy.result.answers[0].answer));
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyByIdSpy } = mockSut();
    const httpResponse = await sut.handle(mockRequest(loadSurveyByIdSpy.result.answers[0].answer));
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
