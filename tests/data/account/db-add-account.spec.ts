/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbAddAccount } from '../../../src/data/usecases/account/add-account/db-add-account';
import {
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from '../../../src/data/usecases/account/add-account/db-add-account-protocols';
import { mockAccountModel, mockAddAccountParams } from '@/domain/test';
import { mockHasher, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '../mocks';

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const mockSut = (): SutTypes => {
  const hasherStub = mockHasher();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositorySpy();

  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(null);

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositorySpy,
    loadAccountByEmailRepositoryStub
  );
  return {
    sut,
    hasherStub,
    addAccountRepositorySpy,
    loadAccountByEmailRepositoryStub,
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

  test('Should return false if LoadAccountByEmailRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = mockSut();

    addAccountRepositorySpy.result = false;

    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBe(false);
  });

  test('Should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut();

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(mockAccountModel());

    const isValid = await sut.add(mockAddAccountParams());
    expect(isValid).toBeFalsy();
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = mockSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.add(mockAddAccountParams());
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
