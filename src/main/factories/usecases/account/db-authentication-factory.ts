import env from '@/main/config/env';
import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication';
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories';
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter';
import { JwtAdapter } from '@/infra/criptography/jwt-adapter';
import { Authentication } from '@/domain/usercases/account/authentication';

export const makeDbAuthentication = (): Authentication => {
  const SALT = 12;
  const bcryptAdapter = new BcryptAdapter(SALT);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
