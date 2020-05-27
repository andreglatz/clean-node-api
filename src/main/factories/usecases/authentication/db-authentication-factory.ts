import env from '../../../config/env'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptofraphy/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptofraphy/jwt-adapter/jwt-adapter'
import { Authentication } from '../../../../domain/usercases/authentication'

export const makeDbAuthentication = (): Authentication => {
  const SALT = 12
  const bcryptAdapter = new BcryptAdapter(SALT)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
