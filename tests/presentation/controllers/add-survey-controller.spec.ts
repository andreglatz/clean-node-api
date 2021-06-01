import faker from 'faker';
import { AddSurveyController } from '@/presentation/controllers';
import {
  badRequest,
  serverError,
  noContent,
} from '@/presentation/helpers/http/http-helper';
import mockDate from 'mockdate';
import { throwError } from '@/domain/test';
import { mockValidation } from '@/validation/test';
import { mockAddSurvey } from '../mocks';
import { Controller, Validation } from '../protocols';
import { AddSurvey } from '@/domain/usercases/survey/add-survey';

const mockFakeRequest = (): AddSurveyController.Request => ({
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
    },
  ],
});

type SutTypes = {
  sut: Controller;
  validationStub: Validation;
  addSurveyStub: AddSurvey;
};

const mockSut = (): SutTypes => {
  const validationStub = mockValidation();
  const addSurveyStub = mockAddSurvey();
  const sut = new AddSurveyController(validationStub, addSurveyStub);

  return {
    sut,
    validationStub,
    addSurveyStub,
  };
};

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date());
  });

  afterAll(() => {
    mockDate.reset();
  });

  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = mockSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const request = mockFakeRequest();
    await sut.handle(request);
    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = mockSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
    const request = mockFakeRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = mockSut();
    const addSpy = jest.spyOn(addSurveyStub, 'add');
    const request = mockFakeRequest();
    await sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith({ ...request, date: new Date() });
  });

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = mockSut();
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError);
    const request = mockFakeRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 204 on success', async () => {
    const { sut } = mockSut();
    const request = mockFakeRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(noContent());
  });
});
