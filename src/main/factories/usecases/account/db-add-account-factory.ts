import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories';
import { AddAccount } from '@/domain/usercases/account/add-account';

export const makeDbAddAccount = (): AddAccount => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);
};
