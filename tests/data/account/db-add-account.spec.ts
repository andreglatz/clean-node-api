/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbAddAccount } from '../../../src/data/usecases/account/add-account/db-add-account';
import { Hasher } from '../../../src/data/usecases/account/add-account/db-add-account-protocols';
import { mockAccountModel, mockAddAccountParams } from '@/domain/test';
import { mockHasher, AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy;
};

const mockSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy();

  jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail').mockResolvedValue(null);

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy
  );
  return {
    sut,
    hasherStub,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy,
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = mockSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');
    const accountData = mockAddAccountParams();
    await sut.add(accountData);
    expect(hashSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = mockSut();

    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy } = mockSut();
    const addSpy = jest.spyOn(addAccountRepositorySpy, 'add');
    await sut.add(mockAddAccountParams());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
    });
  });

  test('Should return true on success', async () => {
    const { sut } = mockSut();
    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBe(true);
  });

  test('Should return false if CheckAccountByEmailRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = mockSut();

    addAccountRepositorySpy.result = false;

    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBe(false);
  });

  test('Should return false if CheckAccountByEmailRepository returns an account', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = mockSut();

    jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail').mockResolvedValueOnce(true);

    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBeFalsy();
  });

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = mockSut();
    const checkByEmailSpy = jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail');
    await sut.add(mockAddAccountParams());
    expect(checkByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
