import faker from 'faker';
import mockDate from 'mockdate';

import { SaveSurveyResultController } from '@/presentation/controllers';
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import { throwError, mockSurveyResultModel } from '@/domain/test';
import { LoadAnsersBySurveySpy, SaveSurveyResultSpy } from '../mocks';
import { Controller } from '../protocols';
import { SaveSurveyResult } from '@/domain/usercases/survey-result/save-survey-result';

const mockRequest = (answer: string): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: answer,
});

type SutTypes = {
  sut: Controller;
  loadAnswersBySurveySpy: LoadAnsersBySurveySpy;
  saveSurveyResultStub: SaveSurveyResultSpy;
};

const mockSut = (): SutTypes => {
  const loadAnswersBySurveySpy = new LoadAnsersBySurveySpy();
  const saveSurveyResultStub = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultStub);

  return {
    sut,
    loadAnswersBySurveySpy,
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

  test('Should call LoadAnsersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveySpy } = mockSut();
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers');

    const request = mockRequest(loadAnswersBySurveySpy.result[0]);

    await sut.handle(request);
    expect(loadAnswersSpy).toHaveBeenCalledWith(request.surveyId);
  });

  test('Should return 403 if LoadAnsersBySurvey returns null', async () => {
    const { sut, loadAnswersBySurveySpy } = mockSut();

    loadAnswersBySurveySpy.result = [];

    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]));
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 500 if LoadAnsersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveySpy } = mockSut();
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]));
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
    const { sut, saveSurveyResultStub, loadAnswersBySurveySpy } = mockSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const request = mockRequest(loadAnswersBySurveySpy.result[0]);
    await sut.handle(request);
    expect(saveSpy).toHaveBeenCalledWith({
      ...request,
      date: new Date(),
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub, loadAnswersBySurveySpy } = mockSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]));
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, loadAnswersBySurveySpy, saveSurveyResultStub } = mockSut();
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]));
    expect(httpResponse).toEqual(ok(saveSurveyResultStub.result));
  });
});
