/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { HttpRequest, Validation } from '../protocols';
import { Authentication } from '@/domain/usercases/account/authentication';

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
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
    await sut.handle(mockRequest());
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
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
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
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
