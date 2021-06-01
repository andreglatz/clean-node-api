import faker from 'faker';

import { SignUpController } from '@/presentation/controllers';
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';
import { ok, badRequest, serverError, forbidden } from '@/presentation/helpers/http/http-helper';
import { throwError } from '@/domain/test';
import { mockValidation } from '@/validation/test';
import { AddAccountSpy, AuthenticationSpy } from '../mocks';
import { AddAccount } from '@/domain/usercases/account/add-account';
import { Authentication } from '@/domain/usercases/account/authentication';

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password();
  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

type SutTypes = {
  sut: SignUpController;
  addAccountSpy: AddAccount;
  validationStub: Validation;
  authenticationStub: Authentication;
};

const mockSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();

  const validationStub = mockValidation();
  const authenticationStub = new AuthenticationSpy();
  const sut = new SignUpController(addAccountSpy, validationStub, authenticationStub);

  return {
    sut,
    addAccountSpy,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = mockSut();
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = mockSut();
    const addSpy = jest.spyOn(addAccountSpy, 'add');

    const request = mockRequest();
    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password,
    });
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = mockSut();
    jest.spyOn(addAccountSpy, 'add').mockResolvedValueOnce(false);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should return 200 valid data is provided', async () => {
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
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = mockSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    const request = mockRequest();
    await sut.handle(request);
    expect(authSpy).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = mockSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
