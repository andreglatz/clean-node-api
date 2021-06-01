/* eslint-disable @typescript-eslint/no-unused-vars */
import faker from 'faker';

import { LoadAccountByToken } from '../middlewares/auth-middleware-protocols';
import { AddAccount } from '@/domain/usercases/account/add-account';
import { Authentication } from '@/domain/usercases/account/authentication';

export class AddAccountSpy implements AddAccount {
  isValid = true;
  addAccountParas: AddAccount.Params;

  public async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    return this.isValid;
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationResult: Authentication.Result = {
    accessToken: 'any_token',
    name: 'any_name',
  };

  async auth(authentication: Authentication.Params): Promise<Authentication.Result> {
    return this.authenticationResult;
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  loadAccountByTokenResult = { id: faker.datatype.uuid() };

  async load(accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    return this.loadAccountByTokenResult;
  }
}
