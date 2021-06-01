import faker from 'faker';
import { LoginController } from '@/presentation/controllers';
import { MissingParamError } from '@/presentation/errors';
import {
  badRequest,
  serverError,
  unathorized,
  ok,
} from '@/presentation/helpers/http/http-helper';
import { throwError } from '@/domain/test';
import { mockAuthentication } from '../mocks';
import { mockValidation } from '@/validation/test';
import { Validation } from '../protocols';
import { Authentication } from '@/domain/usercases/account/authentication';

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const mockSut = (): SutTypes => {
  const authenticationStub = mockAuthentication();
  const validationStub = mockValidation();
  const sut = new LoginController(validationStub, authenticationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = mockSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const request = mockRequest();
    await sut.handle(request);

    expect(authSpy).toHaveBeenCalledWith(request);
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = mockSut();
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unathorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = mockSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = mockSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token', name: 'any_name' }));
  });

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = mockSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const request = mockRequest();
    await sut.handle(request);
    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = mockSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
