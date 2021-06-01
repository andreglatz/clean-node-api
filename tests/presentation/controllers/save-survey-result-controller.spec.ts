import faker from 'faker';
import mockDate from 'mockdate';

import { SaveSurveyResultController } from '@/presentation/controllers';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import { throwError, mockSurveyResultModel, mockSurveyModel } from '@/domain/test';
import { mockLoadSurveyById, mockSaveSurveyResult } from '../mocks';
import { Controller } from '../protocols';
import { SaveSurveyResult } from '@/domain/usercases/survey-result/save-survey-result';

const surveyModel = mockSurveyModel();

const mockRequest = (): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  accountId: faker.datatype.uuid(),
  answer: surveyModel.answers[0].answer,
});

type SutTypes = {
  sut: Controller;
  loadSurveyByIdStub: LoadSurveyById;
  saveSurveyResultStub: SaveSurveyResult;
};

const mockSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById(surveyModel);
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);

  return {
    sut,
    loadSurveyByIdStub,
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
    const { sut, saveSurveyResultStub } = mockSut();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    const request = mockRequest();
    await sut.handle(request);
    expect(saveSpy).toHaveBeenCalledWith({
      ...request,
      date: new Date(),
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = mockSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = mockSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()));
  });
});
