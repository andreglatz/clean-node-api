/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository,
} from '@/data/usecases/account/authentication/db-authentication-protocols';

import { throwError, mockAuthentication } from '@/domain/test';
import {
  LoadAccountByEmailRepositorySpy,
  mockEncrypter,
  mockHashComparer,
  mockUpdateAccessTokenRepository,
} from '../mocks';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const mockSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerStub = mockHashComparer();
  const encrypterStub = mockEncrypter();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = mockSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail');
    await sut.auth(mockAuthentication());
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = mockSut();
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should retrun null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = mockSut();
    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockReturnValueOnce(Promise.resolve(null));
    const authenticationModel = await sut.auth(mockAuthentication());
    expect(authenticationModel).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub, loadAccountByEmailRepositorySpy } = mockSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth(mockAuthentication());
    expect(compareSpy).toHaveBeenCalledWith(
      'any_password',
      loadAccountByEmailRepositorySpy.result.password
    );
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = mockSut();
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should retrun null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = mockSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false));
    const authenticationModel = await sut.auth(mockAuthentication());
    expect(authenticationModel).toBeNull();
  });

  test('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub, loadAccountByEmailRepositorySpy } = mockSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.auth(mockAuthentication());
    expect(encryptSpy).toHaveBeenCalledWith(loadAccountByEmailRepositorySpy.result.id);
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = mockSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test('Should returns an AuthenticationModel on success', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = mockSut();
    const { accessToken, name } = await sut.auth(mockAuthentication());
    expect(accessToken).toBe('any_token');
    expect(name).toBe(loadAccountByEmailRepositorySpy.result.name);
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub, loadAccountByEmailRepositorySpy } = mockSut();
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    await sut.auth(mockAuthentication());
    expect(updateAccessTokenSpy).toHaveBeenCalledWith(
      loadAccountByEmailRepositorySpy.result.id,
      'any_token'
    );
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = mockSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      .mockImplementationOnce(throwError);
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
