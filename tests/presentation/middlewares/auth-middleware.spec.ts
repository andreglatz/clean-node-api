/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthMiddleware } from '../../../src/presentation/middlewares/auth-middleware';
import { LoadAccountByToken } from '../../../src/presentation/middlewares/auth-middleware-protocols';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import { throwError } from '@/domain/test';
import { mockloadAccountByToken } from '../mocks';

const mockFakeRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token',
});

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const mockSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockloadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = mockSut();
    const request = {};
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = mockSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');

    const request = mockFakeRequest();
    await sut.handle(request);
    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = mockSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null));
    const request = mockFakeRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = mockSut();
    const request = mockFakeRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }));
  });

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = mockSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError);
    const request = mockFakeRequest();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});