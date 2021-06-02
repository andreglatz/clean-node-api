import mockDate from 'mockdate';

import { LoadAnswersBySurveyRepositorySpy } from '../mocks';
import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-surveys-by-id/db-load-answers-by-survey';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy;
};

const mockSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy);

  return {
    sut,
    loadAnswersBySurveyRepositorySpy,
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
    const { sut, loadAnswersBySurveyRepositorySpy } = mockSut();
    const loadAnswersSpy = jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers');

    await sut.loadAnswers('any_id');
    expect(loadAnswersSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should return answers on sucess', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = mockSut();
    const answers = await sut.loadAnswers('any_id');

    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result);
  });

  test('Should return empty array if LoadSurveyByIdRepository return null', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = mockSut();
    loadAnswersBySurveyRepositorySpy.result = [];

    const answers = await sut.loadAnswers('surveyId');

    expect(answers).toEqual([]);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = mockSut();
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockRejectedValueOnce(new Error());

    const promise = sut.loadAnswers('any_id');
    await expect(promise).rejects.toThrow();
  });
});
