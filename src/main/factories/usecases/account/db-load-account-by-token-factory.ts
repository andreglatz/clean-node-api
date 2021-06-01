import { LoadAccountByToken } from '@/domain/usercases/account/load-account-by-token';
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token';
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter';
import env from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
