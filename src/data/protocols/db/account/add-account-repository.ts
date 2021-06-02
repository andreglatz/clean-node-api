import { AddAccount } from '@/domain/usercases/account/add-account';

export interface AddAccountRepository {
  add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result>;
}

export namespace AddAccountRepository {
  export type Params = AddAccount.Params;

  export type Result = boolean;
}
