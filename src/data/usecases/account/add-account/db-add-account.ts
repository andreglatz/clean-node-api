import { AddAccount, Hasher, AddAccountRepository } from './db-add-account-protocols';
import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);

    let isValid = false;

    if (!account) {
      const hashedPassword = await this.hasher.hash(accountData.password);

      isValid = await this.addAccountRepository.add({
        ...accountData,
        password: hashedPassword,
      });
    }

    return isValid;
  }
}
