import mockDate from 'mockdate';

import { LoadSurveyByIdRepositorySpy } from '../mocks';
import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-surveys-by-id/db-load-answers-by-survey';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy;
};

const mockSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyByIdRepositorySpy,
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
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById');
    await sut.loadAnswers(loadSurveyByIdRepositorySpy.result.id);
    expect(loadByIdSpy).toHaveBeenCalledWith(loadSurveyByIdRepositorySpy.result.id);
  });

  test('Should return answers on sucess', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    const answers = await sut.loadAnswers(loadSurveyByIdRepositorySpy.result.id);

    const expectAnswers = loadSurveyByIdRepositorySpy.result.answers.map(answer => answer.answer);

    expect(answers).toEqual(expectAnswers);
  });

  test('Should return empty array if LoadSurveyByIdRepository return null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    loadSurveyByIdRepositorySpy.result = null;

    const answers = await sut.loadAnswers('surveyId');

    expect(answers).toEqual([]);
  });

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = mockSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValueOnce(new Error());

    const promise = sut.loadAnswers(loadSurveyByIdRepositorySpy.result.id);
    await expect(promise).rejects.toThrow();
  });
});
