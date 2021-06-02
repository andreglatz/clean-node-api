import { AddAccountRepository } from '../protocols/db/account/add-account-repository';
import { AccountModel, AddAccount } from '../usecases/account/add-account/db-add-account-protocols';
import { mockAccountModel } from '@/domain/test';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository';

import faker from 'faker';
import { CheckAccountByEmailRepository } from '../protocols/db/account';

export class AddAccountRepositorySpy implements AddAccountRepository {
  result = true;

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    return this.result;
  }
}

export class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
  result = false;

  async checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result> {
    return this.result;
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password(),
  };

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
    return this.result;
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  loadAccountByTokenRepositoryResult = mockAccountModel();

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    return this.loadAccountByTokenRepositoryResult;
  }
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};
