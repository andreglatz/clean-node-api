/* eslint-disable @typescript-eslint/no-unused-vars */
import { mockAccountModel } from '@/domain/test';
import { AccountModel, LoadAccountByToken } from '../middlewares/auth-middleware-protocols';
import { AuthenticationModel } from '@/domain/models/authentication';
import { AddAccount } from '@/domain/usercases/account/add-account';
import { Authentication, AuthenticationParams } from '@/domain/usercases/account/authentication';

export class AddAccountSpy implements AddAccount {
  isValid = true;
  addAccountParas: AddAccount.Params;

  public async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    return this.isValid;
  }
}

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationParams): Promise<AuthenticationModel> {
      const authenticationModel = {
        accessToken: 'any_token',
        name: 'any_name',
      };

      return Promise.resolve(authenticationModel);
    }
  }

  return new AuthenticationStub();
};

export const mockloadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByTokenStub();
};
