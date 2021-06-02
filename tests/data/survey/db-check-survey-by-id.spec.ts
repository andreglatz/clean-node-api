import mockDate from 'mockdate';
import faker from 'faker';

import { CheckSurveyByIdRepositorySpy } from '../mocks';
import { DbCheckSurveyById } from '@/data/usecases/survey/load-surveys-by-id/db-check-survey-by-id';

type SutTypes = {
  sut: DbCheckSurveyById;
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy;
};

const mockSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy();
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy);

  return {
    sut,
    checkSurveyByIdRepositorySpy,
  };
};

describe('DbCheckSurveyById', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call CheckSurveyByIdRepository with correct id', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = mockSut();
    const checkByIdSpy = jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById');
    const id = faker.datatype.uuid();

    await sut.checkById(id);
    expect(checkByIdSpy).toHaveBeenCalledWith(id);
  });

  test('Should return true if CheckSurveyByIdRepository return true', async () => {
    const { sut } = mockSut();

    const isValid = await sut.checkById(faker.datatype.uuid());
    expect(isValid).toBe(true);
  });

  test('Should return false if CheckSurveyByIdRepository return false', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = mockSut();
    checkSurveyByIdRepositorySpy.result = false;

    const isValid = await sut.checkById(faker.datatype.uuid());
    expect(isValid).toBe(false);
  });

  test('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = mockSut();
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockRejectedValueOnce(new Error());

    const promise = sut.checkById(faker.datatype.uuid());

    await expect(promise).rejects.toThrow();
  });
});
